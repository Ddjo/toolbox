import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Socket } from 'ngx-socket-io';
import { catchError, filter, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatRoomsStore } from '../store/chat/chat-room.store';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { CHAT_MESSAGE_SEND_MESSAGE, CHAT_MESSAGE_TYPING_MESSAGE } from '@constants';
import { ChatMessagesStore } from '../store/chat/chat-message.store';

export const url = environment.gatewayApiUrl + '/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends Socket {

  readonly chatRoomsStore = inject(ChatRoomsStore);
  readonly chatMessagesStore = inject(ChatMessagesStore);


  public constructor(private http: HttpClient, ) {
    super({
      url: environment.chatWsUrl,
      options: {},
    });

    this.fromEvent('ws-exception').subscribe((err) => console.error(err))
  }

  getChatRoomsForUser() {
    this.chatRoomsStore.setLoading(true);
    return this.http.get<IChatRoom[]>(url).pipe(
      tap(chatRooms =>this.chatRoomsStore.setChatRooms(chatRooms)),
      tap(() => this.chatRoomsStore.setLoading(false))
    );
  }

  getMessagesForChatroom(chatRoom: IChatRoom) {
    this.chatMessagesStore.setLoading(true);
    return this.http.get<IChatMessage[]>(`${url}/${chatRoom._id}/messages`).pipe(
      tap(messages =>this.chatMessagesStore.setChatMessages(messages)),
      tap(() => this.chatMessagesStore.setLoading(false))
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
        const chatRoom = this.chatRoomsStore.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId);
        chatRoom?.messages.push(message);
        this.chatRoomsStore.updateChatRoom(chatRoom as IChatRoom);
      }),
    );
  }


}