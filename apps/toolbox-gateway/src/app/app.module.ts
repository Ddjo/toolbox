
import { AUTH_SERVICE } from '@constants';
import { LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { ChatModule } from './chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    LoggerModule,
    ChatModule,
    BooksModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        GATEWAY_PORT: Joi.number().required(), 
      }),
    }),
    ClientsModule.registerAsync([
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
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}