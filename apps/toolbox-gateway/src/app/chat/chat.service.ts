

import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM, CHAT_ROOM_UPDATE_CHAT_ROOM, CHAT_SERVICE } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TCPService } from '../helpers/tcp.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { Server } from "socket.io";

@Injectable()
export class ChatService {
constructor(
  @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
  private readonly tcpService: TCPService
) {}

  testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  async createMessage(sendMessageDto: SendMessageDto,  user: UserDto, webSocketServer: Server) {
    return this.tcpService.sendTCPMessageFromWebSocketRequest(
      this.chatClient, CHAT_MESSAGE_CREATE_MESSAGE,  
      {...sendMessageDto, user: user},
       webSocketServer
      );
  }

  // getAll() {
  //   return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER,  {});
  // }

  getChatRoomsForUser(user: UserDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER,  user);
  }

  getMessagesForChatRoom(chatRoomId: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM, {chatRoomId});
  }

  createChatRoom(user: UserDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_CREATE_CHAT_ROOM, user);
  }

  async updateChatRoom(_id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_UPDATE_CHAT_ROOM,  {_id, ...updateChatRoomDto});
  }

  removeChatRoom(_id: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_DELETE_CHAT_ROOM,  {_id});
  }

}
