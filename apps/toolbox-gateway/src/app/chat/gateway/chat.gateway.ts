import { CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT, CHAT_MESSAGE_SEEN_MESSAGE, CHAT_MESSAGE_SEND_MESSAGE, CHAT_MESSAGE_EMIT_TYPING_MESSAGE, CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT } from '@constants';
import { CurrentUser, IChatRoom, UserDto, WebsocketExceptionsFilter, WsJwtAuthGuard } from '@libs/common';
import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from '../chat.service';
import { SeenChatMessageDto } from '../dto/seen-chat-message.dto';
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

    
    @SubscribeMessage(CHAT_MESSAGE_SEND_MESSAGE)
    async create(
      @ConnectedSocket() client,
      @MessageBody()  sendChatMessageDto: SendChatMessageDto,
      @CurrentUser() user: UserDto
    ) {
      try {
        console.log('create message before : ', sendChatMessageDto)
        this.chatService.createMessage(sendChatMessageDto, user, this.server).then((res) => {
          console.log('create message res : ', res)
          sendChatMessageDto.chatRoom.members.forEach(member => {
            const chatroom = {
              ...sendChatMessageDto.chatRoom,
              messages : [...sendChatMessageDto.chatRoom.messages, res],
              totalMessages: sendChatMessageDto.chatRoom.messages.length + 1,

            }
            this.server.emit(`${CHAT_MESSAGE_RECEIVE_MESSAGE_EVENT}-${member._id}`, chatroom);
            // this.server.emit(`test`, 'test-content');
          })

        });
      } catch(err){
        console.log('error chat gateway : ', err);
      }
    }
  
    afterInit(client: Socket) {
      // client.use((socket, next) => wsAuthMiddleware(socket, next));
    }

    @SubscribeMessage(CHAT_MESSAGE_EMIT_TYPING_MESSAGE)
    handleTypingMessage(
      @MessageBody()  typingMessageDto: TypingMessageDto,
    )  {
      console.log('gateway emit typing to ', `${typingMessageDto.chatRoom._id}-${CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT}`)
      this.server.emit(`${typingMessageDto.chatRoom._id}-${CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT}`, typingMessageDto.sender.email);
    }

    @SubscribeMessage(CHAT_MESSAGE_SEEN_MESSAGE)
    handleSeenMessage(
      @MessageBody()  seenChatMessageDto: SeenChatMessageDto,
    )  {
      try {
        this.chatService.seenChatMessage(seenChatMessageDto).then(() => {
          this.server.emit(`${CHAT_MESSAGE_SEEN_MESSAGE}-${seenChatMessageDto.chatMessageId}`, seenChatMessageDto.seenBy);
        });
      } catch(err){
        console.log('error chat gateway : ', err);
      } 
    }

}