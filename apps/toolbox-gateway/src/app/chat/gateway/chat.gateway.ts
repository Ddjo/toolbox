import { CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED, CHAT_MESSAGE_EMIT_TYPING_MESSAGE, CHAT_MESSAGE_EMIT_UNTYPING_MESSAGE, CHAT_MESSAGE_SEND_MESSAGE, CHAT_ROOM_NEW_CHAT_FOR_USER_EVENT, CHAT_ROOM_UPDATE_EVENT, ChatRoomUpdateType } from '@constants';
import { ChatRoomDocument, ChatRoomUpdateEvent, CurrentUser, IChatMessage, UserDto, UserTypingEvent, UserUntypingEvent, WebsocketExceptionsFilter, WsJwtAuthGuard } from '@libs/common';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";
import { ChatService } from '../chat.service';
import { AddViewerToChatMessageDto } from '../dto/add-viewer-to-chat-message.dto';
import { SendChatMessageDto } from '../dto/send-chat-message.dto';
import { TypingMessageDto } from '../dto/typing-message.dto';

// @WebSocketGateway({cors: { origin :  ['http://localhost:4200']}})
@WebSocketGateway()
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@UseGuards(WsJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private chatService: ChatService) {}

    @WebSocketServer()
    server: Server;


    handleConnection() {
        console.log('connection made');
    }

    handleDisconnect() {
        console.log('disconnected');
    }

    @OnEvent(ChatRoomUpdateType.ChatroomCreated)
    handleChatroomCreatedEvent(chatRoom: ChatRoomDocument) {
      chatRoom.members.forEach(member => {
        this.server.emit(`${member._id}-${CHAT_ROOM_NEW_CHAT_FOR_USER_EVENT}`, chatRoom);
      })
    }
    
    @SubscribeMessage(CHAT_MESSAGE_SEND_MESSAGE)
    async create(
      @ConnectedSocket() client,
      @MessageBody()  sendChatMessageDto: SendChatMessageDto,
      @CurrentUser() user: UserDto
    ) {
      try {
        this.chatService.createMessage(sendChatMessageDto, user, this.server).then((res) => {
          const chatRoomUpdateEvent: ChatRoomUpdateEvent = {
            chatRoomId: sendChatMessageDto.chatRoom._id.toString(),
            updateType: ChatRoomUpdateType.NewMessage,
            payload : res as IChatMessage,
          };

          this.server.emit(`${sendChatMessageDto.chatRoom._id.toString()}-${CHAT_ROOM_UPDATE_EVENT}`, chatRoomUpdateEvent);

        });
      } catch(err){
        console.log('error chat gateway : ', err);
      }
    }
  


    @SubscribeMessage(CHAT_MESSAGE_EMIT_TYPING_MESSAGE)
    handleTypingMessage(
      @MessageBody()  typingMessageDto: TypingMessageDto,
    )  {
      const chatRoomUpdateEvent: ChatRoomUpdateEvent = {
        chatRoomId: typingMessageDto.chatRoom._id.toString(),
        updateType: ChatRoomUpdateType.UserTyping,
        payload : {
          userEmail: typingMessageDto.sender.email.toString()
        } as UserTypingEvent,
      };

      this.server.emit(`${typingMessageDto.chatRoom._id}-${CHAT_ROOM_UPDATE_EVENT}`, chatRoomUpdateEvent);
    }

    @SubscribeMessage(CHAT_MESSAGE_EMIT_UNTYPING_MESSAGE)
    handleUnTypingMessage(
      @MessageBody()  typingMessageDto: TypingMessageDto,
    )  {

      const chatRoomUpdateEvent: ChatRoomUpdateEvent = {
        chatRoomId: typingMessageDto.chatRoom._id.toString(),
        updateType: ChatRoomUpdateType.UserUntyping,
        payload : {
          userEmail: typingMessageDto.sender.email.toString()
        } as UserUntypingEvent,
      };
      
      // console.log(`emit untyping : ${typingMessageDto.chatRoom._id}-${CHAT_ROOM_UPDATE_EVENT}`)
      this.server.emit(`${typingMessageDto.chatRoom._id}-${CHAT_ROOM_UPDATE_EVENT}`, chatRoomUpdateEvent);
    }

    @SubscribeMessage(CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED)
    addViewerToChatMessage(
      @MessageBody()  addViewerToChatMessageDto: AddViewerToChatMessageDto,
    )  {
      try {
        // console.log( 'gatway addViewerToChatMessage : ', addViewerToChatMessageDto)
        this.chatService.addViewerToChatMessage(addViewerToChatMessageDto).then((chatMessage) => {

          const chatRoomUpdateEvent: ChatRoomUpdateEvent = {
            chatRoomId: chatMessage.chatRoomId,
            updateType: ChatRoomUpdateType.SeenMessage,
            payload : chatMessage as IChatMessage,
          };

          // console.log(`emit ${chatMessage.chatRoomId}-${CHAT_ROOM_UPDATE_EVENT}`, chatRoomUpdateEvent)

          this.server.emit(`${chatMessage.chatRoomId}-${CHAT_ROOM_UPDATE_EVENT}`, chatRoomUpdateEvent);
        });
      } catch(err){
        console.log('error chat gateway : ', err);
      } 
    }

}