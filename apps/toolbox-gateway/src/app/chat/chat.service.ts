

import { CHAT_SERVICE } from '@constants';
import { UserDTO } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
constructor( @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
) {}

  testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  createMessage(createMessageDto: CreateMessageDto,  user: UserDTO) {
    console.log('create message from chat service ', {...createMessageDto, sender_id: user._id})
    // return this.chatClient.send('create-message', {...createMessageDto, sender_id: user._id}); 
    return this.chatClient.send('create-message', {...createMessageDto, sender_id: user._id}); 

  }
}
