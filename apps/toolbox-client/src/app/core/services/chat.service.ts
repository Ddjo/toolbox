import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, OnDestroy, Signal } from '@angular/core';
import { CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED, CHAT_MESSAGE_EMIT_TYPING_MESSAGE, CHAT_MESSAGE_EMIT_UNTYPING_MESSAGE, CHAT_MESSAGE_SEND_MESSAGE, CHAT_ROOM_UPDATE_EVENT, ChatRoomUpdateType, LocalStorageVars } from '@constants';
import { ChatRoomUpdateEvent, IChatMessage, IChatRoom, IUser } from '@libs/common';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatRoomsStore } from '../store/chat/chat-room.store';
import { LocalStorageService } from './local-storage.service';


export const url = environment.gatewayApiUrl + '/chat';
export interface IClientChatRoomCache {
  unfoldedChatInterface : boolean;
  activeChatRoomsIds: string[], 
  unfoldedChatRoomsIds: string[]  
}


@Injectable({
  providedIn: 'any',
})
export class ChatService extends Socket implements OnDestroy {
  typingUserDisplayTimeMs = 4000;

  readonly chatRoomsStore = inject(ChatRoomsStore);
  readonly localStorageService = inject(LocalStorageService);
  private destroy$ = new Subject<void>();

  readonly clientChatRoomsConfigSig: Signal<IClientChatRoomCache> = computed(() => {
    return this.localStorageService.getStorageSignal()()[LocalStorageVars.clientChatRoomsConfigCache] || {activeChatRoomsIds: [], unfoldedChatRoomsIds: [], unfoldedChatInterface: false };
  });

  
  public constructor(
    private http: HttpClient, 
  ) {
    super({
      url: environment.chatWsUrl,
      options: {},
    });

    this.fromEvent('ws-exception').subscribe((err) => console.error(err));
  }

  ngOnDestroy(): void {
    // Emit a value to complete all subscriptions using `takeUntil`
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToChatRoomUpdates(chatRoomId: string ){
    this.fromEvent<ChatRoomUpdateEvent>(`${chatRoomId}-${CHAT_ROOM_UPDATE_EVENT}`)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe((chatRoomUpdateEvent: ChatRoomUpdateEvent) => {

      const chatRoom = this.chatRoomsStore.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId) as IChatRoom;

      switch (chatRoomUpdateEvent.updateType) {

          case ChatRoomUpdateType.UserTyping: 
          // Add user to typingUser array
          this.chatRoomsStore.addTypingUser(chatRoom._id, chatRoomUpdateEvent.payload.userEmail)

          // Remove him after 'typingUserDisplayTimeMs'
          setTimeout(() => {
            this.checkTypingUserInStore(chatRoomId, chatRoomUpdateEvent.payload.userEmail);  
          }, this.typingUserDisplayTimeMs);
        break;

        case ChatRoomUpdateType.UserUntyping: 
          // remove user from typingUser array
          this.chatRoomsStore.removeTypingUser(chatRoomId, chatRoomUpdateEvent.payload.userEmail)
        break;

        case ChatRoomUpdateType.NewMessage: 
          this.chatRoomsStore.addMessageToChatRoom(chatRoomId, chatRoomUpdateEvent.payload);
          this.activateChatRoomInStorage(chatRoomId)
        break;

        case ChatRoomUpdateType.SeenMessage:
          this.chatRoomsStore.updateChatMessageInChatRoom(chatRoom._id, chatRoomUpdateEvent.payload);
        break;
      }
    }); 
  }

  loadChatRoomsStore(messagesLimit = environment.chat.messagesToDisplayNumber) {
    let params = new HttpParams();

    params = params.append('messages-limit', messagesLimit);

    // this.chatRoomsStore.setLoading(true);
    this.http.get<IChatRoom[]>(url, { params: params }).pipe(
      tap(chatRooms =>{
        this.chatRoomsStore.setChatRooms(chatRooms.map(chatRoom => {return {...chatRoom, typingUsers: []}}));
        chatRooms.forEach(chatRoom => this.subscribeToChatRoomUpdates(chatRoom._id));
      }),
      // tap(() => this.chatRoomsStore.setLoading(false))
    ).subscribe();
  }

  loadPreviousMessagesForChatRoom(chatRoom: IChatRoom, messagesLimit = environment.chat.messagesToDisplayNumber) {

    let params = new HttpParams();

    // Set the messages number already displayed 
    params = params.append('skip', chatRoom.messages.length);
    params = params.append('messages-limit', messagesLimit);

    // this.chatRoomsStore.setLoading(true);

    return this.http.get<IChatMessage[]>(`${url}/${chatRoom._id}/messages`, { params: params }).pipe(
      tap(messages =>this.chatRoomsStore.addMessagesToChatRoom(chatRoom._id, messages)),
      // tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  startChatWithUser(withUser: IUser): Observable<IChatRoom> {
    // this.chatRoomsStore.setLoading(true);
    return this.http.post<IChatRoom>(url, withUser).pipe(
      tap(chatRoom =>this.chatRoomsStore.addChatRoom({...chatRoom})),
      // tap(() => this.chatRoomsStore.setLoading(false))
    );
  }
  
  updateChatRoom(chatRoom: IChatRoom): Observable<IChatRoom> {
    // this.chatRoomsStore.setLoading(true);
    return this.http.patch<IChatRoom>(`${url}/${chatRoom._id}`, chatRoom).pipe(
      tap(chatRoom =>this.updateChatRoomInStore(chatRoom)),
      // tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  updateChatRoomInStore(chatroom: IChatRoom) {
    this.chatRoomsStore.setChatRoom(chatroom);
  }

  removeChatRoom(id: string): Observable<IChatRoom> {
    // this.chatRoomsStore.setLoading(true);
    return this.http.delete<IChatRoom>(`${url}/${id}`).pipe(
      tap(chatRoom =>this.chatRoomsStore.removeChatRoom(chatRoom._id)),
      tap(chatRoom => this.desactivateChatRoomInStorage(chatRoom._id)),
      // tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  addMemberToChatRoom(chatRoom: IChatRoom, user: IUser): Observable<IChatRoom> {
    return this.updateChatRoom({
      ...chatRoom,
      members: [
        ...chatRoom.members, 
        user
      ]
    });
  }

  removeMemberFromChatRoom(chatRoom: IChatRoom, user: IUser): Observable<IChatRoom> {
    return this.updateChatRoom({
      ...chatRoom, 
      members : chatRoom.members.filter(member => member._id !== user._id)
    });
  }

  setMessageAsViewed(chatMessageId: string, viewedBy: IUser) {
    this.emit(CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED, {chatMessageId, view: {user: viewedBy, viewedAt: new Date()}});
  }

  sendTypingSignal(chatRoom: IChatRoom, sender: IUser) {
    this.emit(CHAT_MESSAGE_EMIT_TYPING_MESSAGE, {chatRoom, sender});
  }

  sendUnTypingSignal(chatRoom: IChatRoom, sender: IUser) {
    this.emit(CHAT_MESSAGE_EMIT_UNTYPING_MESSAGE, {chatRoom, sender});
  }

  checkTypingUserInStore(chatRoomId: string, userEmail: string) {

    const startTypingAtTimeStamp = this.chatRoomsStore.chatRoomsEntities()
      .find(chatRoom => chatRoom._id === chatRoomId)?.typingUsers
      .find(typingUser => typingUser.userMail === userEmail)?.startTypingAtTimeStamp as number; 
      
      if (Date.now() - startTypingAtTimeStamp > this.typingUserDisplayTimeMs) 
        this.chatRoomsStore.removeTypingUser(chatRoomId, userEmail)
  }

  sendMessage(chatRoom: IChatRoom, sender: IUser, content: string): void {
    this.emit(CHAT_MESSAGE_SEND_MESSAGE, { chatRoom, sender, content}); 
    this.sendUnTypingSignal(chatRoom, sender);
  }

  foldChatInterface() {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.unfoldedChatInterface = false;
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

  unfoldChatInterface() {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.unfoldedChatInterface = true;
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

  activateChatRoomInStorage(chatRoomId: string) {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.activeChatRoomsIds =  [...clientChatRoomsConfigCache.activeChatRoomsIds, chatRoomId];
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

  desactivateChatRoomInStorage(chatRoomId: string) {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.activeChatRoomsIds =  clientChatRoomsConfigCache.activeChatRoomsIds.filter(x => x!== chatRoomId)
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

  foldChatRoomInStorage(chatRoomId: string) {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.unfoldedChatRoomsIds = clientChatRoomsConfigCache.unfoldedChatRoomsIds.filter(x => x!== chatRoomId)
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

  unfoldChatRoomInStorage(chatRoomId: string) {
    const clientChatRoomsConfigCache = this.clientChatRoomsConfigSig();
    clientChatRoomsConfigCache.unfoldedChatRoomsIds =  [...clientChatRoomsConfigCache.unfoldedChatRoomsIds, chatRoomId];
    this.localStorageService.set(LocalStorageVars.clientChatRoomsConfigCache, clientChatRoomsConfigCache);
  }

}