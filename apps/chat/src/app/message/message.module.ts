import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { MessageDocument, MessageSchema } from './entities/message.schemas';
import { MessageController } from './message.controller';
import { DatabaseModule } from '@libs/common';
import { MessageRepository } from './message.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MessageDocument.name, schema: MessageSchema },
    ]),
    // MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [
    MessageService,
    MessageRepository
  ],
  controllers: [
    MessageController
  ],
  exports: [
    MessageService
  ]
})
export class MessagesModule { }
