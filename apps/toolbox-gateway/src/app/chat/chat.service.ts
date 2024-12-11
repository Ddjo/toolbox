

import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_UPDATE_CHAT_ROOM, CHAT_SERVICE } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Injectable()
export class ChatService {
constructor( @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
) {}

  testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  async createMessage(sendMessageDto: SendMessageDto,  user: UserDto) {
    try {
      return await lastValueFrom(this.chatClient.send(CHAT_MESSAGE_CREATE_MESSAGE, {...sendMessageDto, user: user}));
    } catch (err) {
      console.log('error toolbox-gateway - ChatService - createMessage : ', err)
    }

  }

  getAll() {
    return this.chatClient.send('get-all-chat-rooms', {})
  }

  getAllForUser(user: UserDto) {
    return this.chatClient.send(CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, user)
  }

  create(user: UserDto) {
    return this.chatClient.send(CHAT_ROOM_CREATE_CHAT_ROOM, user)
  }

  update(_id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatClient.send(CHAT_ROOM_UPDATE_CHAT_ROOM, {_id, ...updateChatRoomDto})
  }

  remove(_id: string) {
    return this.chatClient.send(CHAT_ROOM_DELETE_CHAT_ROOM, {_id})
  }

}
