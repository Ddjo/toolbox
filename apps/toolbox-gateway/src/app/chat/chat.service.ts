

import { CHAT_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChatService {
constructor( @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
) {}

  testChat() {
    return this.chatClient.send('test-chat', {}); 
  }
}
