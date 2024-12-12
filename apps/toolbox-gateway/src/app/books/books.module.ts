import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH_SERVICE, BOOKS_SERVICE } from "@constants";
import { ConfigService } from "@nestjs/config";
import { TCPService } from "../helpers/tcp.service";

@Module({
    providers: [BooksService, TCPService],
    controllers: [BooksController],
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
          name: BOOKS_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: configService.get('BOOKS_HOST'),
              port: configService.get('BOOKS_TCP_PORT'),
            },
          }),
          inject: [ConfigService],
        }, 
      ]),]
})
export class BooksModule{}