import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environments';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends Socket {
  public constructor() {
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


}