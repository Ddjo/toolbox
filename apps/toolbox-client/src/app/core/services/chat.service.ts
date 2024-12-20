import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, effect, inject, Injectable, OnDestroy, Signal } from '@angular/core';
import { CHAT_MESSAGE_EMIT_TYPING_MESSAGE, CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT, CHAT_MESSAGE_SEEN_MESSAGE, CHAT_MESSAGE_SEND_MESSAGE, LocalStorageVars } from '@constants';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { Socket } from 'ngx-socket-io';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatRoomsStore } from '../store/chat/chat-room.store';
import { AuthService } from './auth.service';
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

  readonly chatRoomsStore = inject(ChatRoomsStore);
  readonly localStorageService = inject(LocalStorageService);
  // readonly activeChatsSig: Signal<string[]> = computed(() => {
  //   return this.localStorageService.getStorageSignal()()[LocalStorageVars.activeChats].split(',') || [];
  // })

  readonly clientChatRoomsConfigSig: Signal<IClientChatRoomCache> = computed(() => {
    return this.localStorageService.getStorageSignal()()[LocalStorageVars.clientChatRoomsConfigCache] || {activeChatRoomsIds: [], unfoldedChatRoomsIds: [], unfoldedChatInterface: false };
  });

  


  public constructor(
    private http: HttpClient, 
    // private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    super({
      url: environment.chatWsUrl,
      options: {},
    });

    this.fromEvent('ws-exception').subscribe((err) => console.error(err));

    // effect(() => {
    //   console.log('listening to ', `${CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT}-${this.authService.currentUserSig()?._id}`)
    //   // this.fromEvent<IChatMessage>(`${CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT}-${this.authService.currentUserSig()?._id}`).pipe(
    //   this.fromEvent<IChatMessage>(`test`).pipe(
    //     // filter(chatMessage => !!chatMessage),
    //     tap((message) => {
    //       console.log(' new message  !!!', message)
    //       // const chatRoom = {...this.chatRoomsStore.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId)} as IChatRoom;
    //       // chatRoom.messages = [...chatRoom.messages, message];
    //       // this.chatRoomsStore.updateChatRoom(chatRoom as IChatRoom);
    //     }),
    //   );
    // });
    
  }

  ngOnDestroy(): void {
      console.log('service chat destroyed')
  }

  loadChatRoomsStore(messagesLimit = environment.chat.messagesToDisplayNumber) {
    if (!this.chatRoomsStore.loaded())  {      

      let params = new HttpParams();

      params = params.append('messages-limit', messagesLimit);

      this.chatRoomsStore.setLoading(true);
      this.http.get<IChatRoom[]>(url, { params: params }).pipe(
        tap(chatRooms =>this.chatRoomsStore.setChatRooms(chatRooms)),
        tap(() => this.chatRoomsStore.setLoading(false))
      ).subscribe();
    }
  }

  loadPreviousMessagesForChatRoom(chatRoom: IChatRoom, messagesLimit = environment.chat.messagesToDisplayNumber) {

    let params = new HttpParams();

    // Set the messages number already displayed 
    params = params.append('skip', chatRoom.messages.length);
    params = params.append('messages-limit', messagesLimit);

    this.chatRoomsStore.setLoading(true);

    return this.http.get<IChatMessage[]>(`${url}/${chatRoom._id}/messages`, { params: params }).pipe(
      tap(messages =>this.chatRoomsStore.addMessagesToChatRoom(chatRoom, messages)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  startChatWithUser(withUser: IUser): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.post<IChatRoom>(url, withUser).pipe(
      tap(chatRoom =>this.chatRoomsStore.addChatRoom(chatRoom)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }
  
  updateChatRoom(chatRoom: IChatRoom): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.patch<IChatRoom>(`${url}/${chatRoom._id}`, chatRoom).pipe(
      tap(chatRoom =>this.updateChatRoomInStore(chatRoom)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  updateChatRoomInStore(chatroom: IChatRoom) {
    this.chatRoomsStore.setChatRoom(chatroom);
  }

  removeChatRoom(id: string): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.delete<IChatRoom>(`${url}/${id}`).pipe(
      tap(chatRoom =>this.chatRoomsStore.removeChatRoom(chatRoom)),
      tap(chatRoom => this.desactivateChatRoomInStorage(chatRoom._id)),
      tap(() => this.chatRoomsStore.setLoading(false))
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

  sendSeenChatMessage(chatMessageId: string, seenBy: IUser) {
    this.emit(CHAT_MESSAGE_SEEN_MESSAGE, {chatMessageId, seenBy});
  }

  getSeenChatMessage(chatMessageId: string) {
    return this.fromEvent<IUser>(`${CHAT_MESSAGE_SEEN_MESSAGE}-${chatMessageId}`);
  }

  sendTypingSignal(chatRoom: IChatRoom, sender: IUser) {
    this.emit(CHAT_MESSAGE_EMIT_TYPING_MESSAGE, {chatRoom, sender});
  }

  sendMessage(chatRoom: IChatRoom, sender: IUser, content: string): void {
    this.emit(CHAT_MESSAGE_SEND_MESSAGE, { chatRoom, sender, content}); 
  }

  // getNewMessage(chatRoomId: string): Observable<IChatMessage> {
  //   return this.fromEvent<IChatMessage>(`${CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT}-${}`).pipe(
  //     filter(chatMessage => !!chatMessage),
  //     tap((message) => {
  //       console.log(' new message  !!!')
  //       const chatRoom = {...this.chatRoomsStore.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId)} as IChatRoom;
  //       chatRoom.messages = [...chatRoom.messages, message];
  //       this.chatRoomsStore.updateChatRoom(chatRoom as IChatRoom);
  //     }),
  //   );
  // }

  // getActiveChatRoomsIdFromStorage(): string[] {
  //   const activeChatRoomsValue = this.localStorageService.get<string>( LocalStorageVars.activeChats);

  //   return activeChatRoomsValue?.split(',').filter(x => !!x) || [];
  // }

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