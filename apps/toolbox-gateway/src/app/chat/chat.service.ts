

import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_GET_OR_CREATE_CHAT_ROOM, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM, CHAT_ROOM_UPDATE_CHAT_ROOM, CHAT_SERVICE, ChatRoomUpdateType } from '@constants';
import { IChatMessage, IChatRoom, UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Server } from "socket.io";
import { TCPService } from '../helpers/tcp.service';
import { AddViewerToChatMessageDto } from './dto/add-viewer-to-chat-message.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';


@Injectable()
export class ChatService {
constructor(
  @Inject(CHAT_SERVICE) private readonly chatClient: ClientProxy,    
  private readonly tcpService: TCPService,
  private readonly eventEmitter: EventEmitter2
) {}

async testChat() {
    return this.chatClient.send('test-chat', {}); 
  }

  async createMessage(sendChatMessageDto: SendChatMessageDto,  user: UserDto, webSocketServer: Server) {

    const payload = {
      ...sendChatMessageDto,
    };

    delete payload.chatRoom;
    payload['chatRoomId'] = sendChatMessageDto.chatRoom._id;

    return await this.tcpService.sendTCPMessageFromWebSocketRequest(
      this.chatClient, CHAT_MESSAGE_CREATE_MESSAGE,  
      {
        ...payload, 
        user: user
      },
       webSocketServer
      );
  }

  async addViewerToChatMessage(addViewerToChatMessageDto: AddViewerToChatMessageDto): Promise<IChatMessage> {
    return this.tcpService.sendTCPMessageFromHttpRequest<IChatMessage>(this.chatClient, CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED,  addViewerToChatMessageDto);
  }

  async getChatRoomsForUser(user: UserDto, messagesLimit : number) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER,  {user, messagesLimit});
  }

  async findPreviousMessagesForChatRoom(chatRoomId: string, skip: number, messagesLimit: number) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM, {chatRoomId, skip, messagesLimit});
  }

  async startChatWithUser(user: UserDto, withUser: UserWithoutPasswordDto ): Promise<IChatRoom> {
    const users = {
      creator: user,
      withUser: withUser
    }

    const chatRoom = await this.tcpService.sendTCPMessageFromHttpRequest<IChatRoom>(this.chatClient, CHAT_ROOM_GET_OR_CREATE_CHAT_ROOM, users);
    this.eventEmitter.emit(ChatRoomUpdateType.ChatroomCreated, chatRoom);

    return chatRoom;
  }

  async updateChatRoom(_id: string, updateChatRoomDto: UpdateChatRoomDto): Promise<IChatRoom> {
    return this.tcpService.sendTCPMessageFromHttpRequest<IChatRoom>(this.chatClient, CHAT_ROOM_UPDATE_CHAT_ROOM,  {_id, ...updateChatRoomDto});
  }

  async removeChatRoom(_id: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.chatClient, CHAT_ROOM_DELETE_CHAT_ROOM,  {_id});
  }

}
