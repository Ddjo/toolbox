import { ChatMessageDocument, ChatRoomDocument, DatabaseModule, MessageSchema, RoomSchema, UserDocument, UserSchema } from '@libs/common';
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { RoomRepository } from '../rooms/rooms.repository';
import { DB_CHAT_MESSAGES_DOCUMENT, DB_CHAT_ROOMS_DOCUMENT, DB_USERS_DOCUMENT } from '@constants';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: DB_CHAT_MESSAGES_DOCUMENT, schema: MessageSchema },
      { name: DB_CHAT_ROOMS_DOCUMENT, schema: RoomSchema },
      { name: DB_USERS_DOCUMENT, schema: UserSchema },
    ]),
  ],
  providers: [
    MessageService,
    MessageRepository,
    RoomRepository
  ],
  controllers: [
    MessageController
  ],
  exports: [
    MessageService
  ]
})
export class MessagesModule { }
