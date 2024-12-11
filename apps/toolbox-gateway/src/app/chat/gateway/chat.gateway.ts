import { CurrentUser, UserDto, WsJwtAuthGuard } from '@libs/common';
import { ArgumentsHost, BadRequestException, Catch, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseWsExceptionFilter, ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from '../chat.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { CHAT_MESSAGE_SEND_MESSAGE } from '@constants';

@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }
}

// @WebSocketGateway({cors: { origin :  ['http://localhost:4200']}})
@WebSocketGateway()
@UseFilters(BadRequestTransformationFilter)
@UsePipes(new ValidationPipe())
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
    //   @MessageBody(new ValidationPipe())  createChatDto: CreateMessageDto,
      @MessageBody()  sendMessageDto: SendMessageDto,
      @CurrentUser() user: UserDto
    ) {
      try {

        this.chatService.createMessage(sendMessageDto, user).then((res) => {
              this.server.emit(`${sendMessageDto.chatRoom._id}/new-message`, res);
          }
      );

      } catch(err){
        console.log('error chat gateway : ', err);
      }
    }
  
    afterInit(client: Socket) {
      // client.use((socket, next) => wsAuthMiddleware(socket, next));
    }

    @SubscribeMessage('typing-message')
    handleTypingMessage() : string {

        console.log('type-message received')

        this.chatService.testChat().subscribe(console.log);

        // console.log('data : ', data)
        // console.log('client : ', client)
        // console.log('user : ', user)

        // this.server.emit('new-message', message);

        return 'Hello chat gateway';
    }

    @SubscribeMessage('test-chat')
    handleMessage(
        @MessageBody() data: string,
        @ConnectedSocket() client: Socket,
        @CurrentUser() user: UserDto
    ) : string {

        console.log('test-chat received')

        this.chatService.testChat().subscribe(console.log);

        // console.log('data : ', data)
        // console.log('client : ', client)
        // console.log('user : ', user)

        // this.server.emit('new-message', message);

        return 'Hello chat gateway';
    }
}