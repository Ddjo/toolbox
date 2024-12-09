

import { CHAT_SERVICE } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Injectable()
export class ChatService {
constructor( @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
) {}

  testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  createMessage(createMessageDto: CreateMessageDto,  user: UserDto) {
    return this.chatClient.send('create-message', {...createMessageDto, user: user}); 
  }

  getAll() {
    return this.chatClient.send('get-all-chat-rooms', {})
  }

  getAllForUser(user: UserDto) {
    return this.chatClient.send('get-all-chat-rooms-for-user', user)
  }

  create(user: UserDto) {
    return this.chatClient.send('create-chat-room', user)
  }

  update(_id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatClient.send('update-chat-room', {_id, ...updateChatRoomDto})
  }

  remove(_id: string) {
    return this.chatClient.send('remove-chat-room', {_id})
  }

}
