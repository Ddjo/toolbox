import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Socket } from 'ngx-socket-io';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatRoomsStore } from '../store/chat/chat-room.store';
import { IChatRoom, IUser } from '@libs/common';
import { CHAT_MESSAGE_SEND_MESSAGE } from '@constants';

export const url = environment.gatewayApiUrl + '/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends Socket {

  readonly chatRoomsStore = inject(ChatRoomsStore);

  public constructor(private http: HttpClient, ) {
    super({
      url: environment.chatWsUrl,
      options: {},
    });
  }

  getChatRooms() {
    this.chatRoomsStore.setLoading(true);
    return this.http.get<IChatRoom[]>(url).pipe(
      tap(chatRooms =>this.chatRoomsStore.setChatRooms(chatRooms)),
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

  sendTypingSignal(isTyping: boolean) {
    console.log('send typing signal')
    this.emit('typing-message');
    // this.socket$.next({ event: 'typing', data: { isTyping } });
  }

  sendMessage(chatRoom: IChatRoom, sender: IUser, content: string): void {
    this.emit(CHAT_MESSAGE_SEND_MESSAGE, { chatRoom, sender, content}); 
  }

  getNewMessage(chatRoom: IChatRoom): Observable<string> {
    return this.fromEvent<string>(`${chatRoom._id}/new-message`);
  }


}