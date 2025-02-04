

import { AUTH_SERVICE, DB_BOOKS_DOCUMENT } from '@constants';
import { DatabaseModule, LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { BooksController } from './books.controller';
import { BookRepository } from './books.repository';
import { BooksService } from './books.service';
import {
  BookSchema
} from './entities/book.entity';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: DB_BOOKS_DOCUMENT, schema: BookSchema },
    ]),
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
          // host: configService.get('AUTH_HOST'),
          port: configService.get('AUTH_PORT'),
        },
      }),
      inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService, BookRepository],
})
export class BooksModule {}