import { ChatMessageDocument, ChatRoomDocument, DatabaseModule, MessageSchema, RoomSchema, UserDocument, UserSchema } from '@libs/common';
import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';
import { MessageRepository } from '../message/message.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ChatMessageDocument.name, schema: MessageSchema },
      { name: ChatRoomDocument.name, schema: RoomSchema },
      { name: UserDocument.name, schema: UserSchema },
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
