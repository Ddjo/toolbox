

import { AUTH_SERVICE } from '@constants';
import { LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesModule } from './message/message.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CHAT_TCP_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
     {
      name: AUTH_SERVICE, 
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get('AUTH_HOST'),
          port: configService.get('AUTH_PORT'),
        },
      }),
      inject: [ConfigService],
      },
    ]),
    MessagesModule,
    RoomsModule
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}