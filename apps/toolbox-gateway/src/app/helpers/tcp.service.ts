import { HttpException, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";


@Injectable()
export class TCPService {

  async sendTCPMessageFromHttpRequest(proxy: ClientProxy, clientMessagePattern: string, payload: object) {
    try {
      return await lastValueFrom(proxy.send(clientMessagePattern, payload));
    } catch (err ) {
      throw new HttpException(err.message, err.statusCode); 
    }
  }
}
