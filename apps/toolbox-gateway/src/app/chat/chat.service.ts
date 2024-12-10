

import { CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_UPDATE_CHAT_ROOM, CHAT_SERVICE } from '@constants';
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
