import { AUTH_SERVICE, CHAT_SERVICE } from "@constants";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./gateway/chat.gateway";
import { ChatController } from "./chat.controller";

@Module({
    providers: [ChatService, ChatGateway],
    controllers: [ChatController],
    imports: [ ClientsModule.registerAsync([
        {
          name: AUTH_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('AUTH_HOST'),
              port: configService.get('AUTH_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        }, {
          name: CHAT_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('CHAT_HOST'),
              port: configService.get('CHAT_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        }, 
      ]),]
})
export class ChatModule{}