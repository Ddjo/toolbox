import { CurrentUser, UserDTO } from '@libs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { ChatService } from '../chat.service';
// @WebSocketGateway({cors: { origin :  ['http://localhost:4200']}})
@WebSocketGateway()
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