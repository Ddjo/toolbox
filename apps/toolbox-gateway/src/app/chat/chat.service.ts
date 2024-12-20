

import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_MESSAGE_SEEN_MESSAGE, CHAT_ROOM_GET_OR_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM, CHAT_ROOM_UPDATE_CHAT_ROOM, CHAT_SERVICE } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Server } from "socket.io";
import { TCPService } from '../helpers/tcp.service';
import { SeenChatMessageDto } from './dto/seen-chat-message.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';

@Injectable()
export class ChatService {
constructor(
  @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
  private readonly tcpService: TCPService
) {}

async testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  async createMessage(sendChatMessageDto: SendChatMessageDto,  user: UserDto, webSocketServer: Server) {

    const message = {
      ...sendChatMessageDto,
      seenBy: []
    };

    return this.tcpService.sendTCPMessageFromWebSocketRequest(
      this.chatClient, CHAT_MESSAGE_CREATE_MESSAGE,  
      {
        ...message, 
        user: user
      },
       webSocketServer
      );
  }

  async seenChatMessage(seenChatMessageDto: SeenChatMessageDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_MESSAGE_SEEN_MESSAGE,  seenChatMessageDto);
  }

  async getChatRoomsForUser(user: UserDto, messagesLimit : number) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER,  {user, messagesLimit});
  }

  async findPreviousMessagesForChatRoom(chatRoomId: string, skip: number, messagesLimit: number) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM, {chatRoomId, skip, messagesLimit});
  }

  async startChatWithUser(user: UserDto, withUser: UserWithoutPasswordDto ) {
    const users = {
      creator: user,
      withUser: withUser
    }
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_OR_CREATE_CHAT_ROOM, users);
  }

  async updateChatRoom(_id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_UPDATE_CHAT_ROOM,  {_id, ...updateChatRoomDto});
  }

  async removeChatRoom(_id: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_DELETE_CHAT_ROOM,  {_id});
  }

}
