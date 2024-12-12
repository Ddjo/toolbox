import { CurrentUser, UserDto, WsJwtAuthGuard } from '@libs/common';
import { ArgumentsHost, BadRequestException, Catch, HttpException, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BaseWsExceptionFilter, ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from '../chat.service';
import { SendMessageDto } from '../dto/send-message.dto';
import { CHAT_MESSAGE_SEND_MESSAGE } from '@constants';

@Catch(WsException, HttpException)
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as WebSocket;
    const data = host.switchToWs().getData();
    const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
    const details = error instanceof Object ? { ...error } : { message: error };
    console.log('ERRRROOORRRRR')
    client.send(JSON.stringify({
      event: "error",
      data: {
        id: (client as any).id,
        rid: data.rid,
        ...details
      }
    }));
  }
}

// @WebSocketGateway({cors: { origin :  ['http://localhost:4200']}})
@WebSocketGateway()
// @UseFilters(WebsocketExceptionsFilter)
// @UsePipes(new ValidationPipe({ transform: true }))
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
        console.log('SubscribeMessage(CHAT_MESSAGE_SEND_MESSAGE) send ', sendMessageDto)
        this.chatService.createMessage(sendMessageDto, user).then((res) => {
          this.server.emit(`${sendMessageDto.chatRoom._id}/new-message`, res);
        }
      );

      } catch(err){
        // console.log('error chat gateway : ', err);
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