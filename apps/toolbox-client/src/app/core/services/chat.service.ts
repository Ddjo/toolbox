import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CHAT_MESSAGE_SEEN_MESSAGE, CHAT_MESSAGE_SEND_MESSAGE, CHAT_MESSAGE_TYPING_MESSAGE } from '@constants';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { Socket } from 'ngx-socket-io';
import { filter, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatRoomsStore } from '../store/chat/chat-room.store';

export const url = environment.gatewayApiUrl + '/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends Socket {

  readonly chatRoomsStore = inject(ChatRoomsStore);
  // readonly chatMessagesStore = inject(ChatMessagesStore);


  public constructor(private http: HttpClient, ) {
    super({
      url: environment.chatWsUrl,
      options: {},
    });

    this.fromEvent('ws-exception').subscribe((err) => console.error(err))
  }

  getChatRoomsForUser(messagesLimit = environment.chat.messagesToDisplayNumber) {
    let params = new HttpParams();

    params = params.append('messages-limit', messagesLimit);

    this.chatRoomsStore.setLoading(true);
    return this.http.get<IChatRoom[]>(url, { params: params }).pipe(
      tap(chatRooms =>this.chatRoomsStore.setChatRooms(chatRooms)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
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

  createChatRoom(): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.post<IChatRoom>(url, {}).pipe(
      tap(chatRoom =>this.chatRoomsStore.addChatRoom(chatRoom)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }
  
  updateChatRoom(chatRoom: IChatRoom): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.patch<IChatRoom>(`${url}/${chatRoom._id}`, chatRoom).pipe(
      tap(chatRoom =>this.chatRoomsStore.setChatRoom(chatRoom)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  removeChatRoom(id: string): Observable<IChatRoom> {
    this.chatRoomsStore.setLoading(true);
    return this.http.delete<IChatRoom>(`${url}/${id}`).pipe(
      tap(chatRoom =>this.chatRoomsStore.removeChatRoom(chatRoom)),
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
    this.emit(CHAT_MESSAGE_TYPING_MESSAGE, {chatRoom, sender});
  }

  getTypingSignal(chatRoomId: string) {
    return this.fromEvent<string>(`${chatRoomId}-${CHAT_MESSAGE_TYPING_MESSAGE}`);
  }

  sendMessage(chatRoom: IChatRoom, sender: IUser, content: string): void {
    this.emit(CHAT_MESSAGE_SEND_MESSAGE, { chatRoom, sender, content}); 
  }

  getNewMessage(chatRoomId: string): Observable<IChatMessage> {
    return this.fromEvent<IChatMessage>(`${chatRoomId}-${CHAT_MESSAGE_SEND_MESSAGE}`).pipe(
      filter(chatMessage => !!chatMessage),
      tap((message) => {
        const chatRoom = {...this.chatRoomsStore.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId)} as IChatRoom;
        chatRoom.messages = [...chatRoom.messages, message];
        this.chatRoomsStore.updateChatRoom(chatRoom as IChatRoom);
      }),
    );
  }


}