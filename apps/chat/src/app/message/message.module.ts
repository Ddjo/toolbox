import { DatabaseModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { MessageDocument, MessageSchema } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: MessageDocument.name, schema: MessageSchema },
    ]),
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
