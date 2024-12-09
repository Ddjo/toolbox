import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environments';
import { Socket } from 'ngx-socket-io';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ChatRoomsStore } from '../store/chat/chat-room.store';
import { IChatRoom } from '@libs/common';

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

  sendMessage(roomId: string, message: string): void {
    this.emit('send-message', {room_id: roomId, content: message}); 
  }

  getNewMessage(): Observable<string> {
    return this.fromEvent<string>('new-message');
  }

  getChatRooms() {
    return this.http.get<IChatRoom[]>(url).pipe(
      tap(chatRooms =>this.chatRoomsStore.setChatRooms(chatRooms)),
    );
  }

  createChatRoom(): Observable<IChatRoom> {
    return this.http.post<IChatRoom>(url, {}).pipe(
      tap(chatRoom =>this.chatRoomsStore.addChatRoom(chatRoom)),
    );
  }
  
  updateChatRoom(chatRoom: IChatRoom): Observable<IChatRoom> {
    return this.http.patch<IChatRoom>(`${url}/${chatRoom._id}`, chatRoom).pipe(
      tap(chatRoom =>this.chatRoomsStore.setChatRoom(chatRoom)),
    );
  }

  removeChatRoom(id: string): Observable<IChatRoom> {
    return this.http.delete<IChatRoom>(`${url}/${id}`).pipe(
      tap(chatRoom =>this.chatRoomsStore.removeChatRoom(chatRoom)),
    );
  }

  addMemberToChatRoom(chatRoom: IChatRoom): Observable<IChatRoom> {
    return this.http.post<IChatRoom>(`${url}/add-member-to-chat-room`, chatRoom).pipe(
      tap(chatRoom =>this.chatRoomsStore.updateChatRoom(chatRoom)),
    );
  }

  removeMemberFromChatRoom(chatRoom: IChatRoom, userId: string): Observable<IChatRoom> {
    chatRoom.members = chatRoom.members.filter(member => member !== userId);

    return this.updateChatRoom(chatRoom);
  }

}