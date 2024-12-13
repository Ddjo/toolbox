import { HttpException, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { WebSocketServer } from "@nestjs/websockets";
import { lastValueFrom } from "rxjs";
import { Server } from "socket.io";


@Injectable()
export class TCPService {

  @WebSocketServer()
  server: Server;

  async sendTCPMessageFromHttpRequest(proxy: ClientProxy, clientMessagePattern: string, payload: object) {
    try {
      return await lastValueFrom(proxy.send(clientMessagePattern, payload));
    } catch (err ) {
      console.log('sendTCPMessageFromHttpRequest : ', err)
      throw new HttpException(err.message, err.statusCode); 
    }
  }

  async sendTCPMessageFromWebSocketRequest(proxy: ClientProxy, clientMessagePattern: string, payload: object, webSocketServer: Server) {
    try {
      return await lastValueFrom(proxy.send(clientMessagePattern, payload));
    } catch (err ) {
      console.log('sendTCPMessageFromWebSocketRequest : ', err)

      webSocketServer.emit('ws-exception' ,err);

    }
  }
}
