

import { AUTH_SERVICE } from '@constants';
import { LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { ChatController } from './chat.controller';
// import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';
// import {
//   ChatDocument,
//   ChatSchema,
// } from './entities/book.entity';

@Module({
  imports: [
    // DatabaseModule,
    // DatabaseModule.forFeature([
    //   { name: ChatDocument.name, schema: ChatSchema },
    // ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        BOOKS_TCP_PORT: Joi.number().required(),
        BOOKS_HTTP_PORT: Joi.number().required(),      
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
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}