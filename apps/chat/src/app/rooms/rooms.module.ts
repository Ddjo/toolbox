import { DB_CHAT_MESSAGES_DOCUMENT, DB_CHAT_ROOMS_DOCUMENT, DB_USERS_DOCUMENT } from '@constants';
import { DatabaseModule, MessageSchema, RoomSchema, UserSchema } from '@libs/common';
import { Module } from '@nestjs/common';
import { MessageRepository } from '../message/message.repository';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: DB_CHAT_MESSAGES_DOCUMENT, schema: MessageSchema },
      { name: DB_CHAT_ROOMS_DOCUMENT, schema: RoomSchema },
      { name: DB_USERS_DOCUMENT, schema: UserSchema },
    ]),

    ],
  controllers: [RoomsController],
  providers: [
    RoomsService,
    RoomRepository,
    MessageRepository
  ],
  exports: [
    RoomsService,
  ]
})
export class RoomsModule { }
