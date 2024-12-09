import { CurrentUser, UserDTO, WsJwtAuthGuard } from '@libs/common';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from '../chat.service';
import { CreateMessageDto } from '../dto/create-message.dto';

// @WebSocketGateway({cors: { origin :  ['http://localhost:4200']}})
@WebSocketGateway()
// @UseFilters(BadRequestExceptionsFilter)
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

    
    @SubscribeMessage('send-message')
    async create(
      @ConnectedSocket() client,
    //   @MessageBody(new ValidationPipe())  createChatDto: CreateMessageDto,
      @MessageBody()  createChatDto: CreateMessageDto,
      @CurrentUser() user: UserDTO
    ) {
      // const senderId = client.handshake.user._id.toString();
      // const chat = await this.chatService.createMessage(createChatDto, user);
  
      try {
        this.chatService.createMessage(createChatDto, user).subscribe(res => {
  
          this.server.emit('new-message', res);
        })
      } catch(err){
        console.log('error chat gateway : ', err);
      }
    }
  
    afterInit(client: Socket) {
      // client.use((socket, next) => wsAuthMiddleware(socket, next));
    }

    @SubscribeMessage('type-message')
    handleTypeMessage() : string {

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
        @CurrentUser() user: UserDTO
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