import { ChatMessageDocument, ChatRoomDocument, DatabaseModule, MessageSchema, RoomSchema } from '@libs/common';
import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { RoomRepository } from '../rooms/rooms.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ChatMessageDocument.name, schema: MessageSchema },
      { name: ChatRoomDocument.name, schema: RoomSchema },
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
