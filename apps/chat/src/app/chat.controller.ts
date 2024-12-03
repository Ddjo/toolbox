import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @MessagePattern('test-chat')
  async testChat() {
    console.log('test-chat received');
    return [];
  }


}