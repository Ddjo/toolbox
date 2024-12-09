import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}


  @MessagePattern('create-message')
  async createMessage(@Payload() createMessageDto: CreateMessageDto) {
    console.log('create message received message controller', createMessageDto); 
    console.log('create message messageService  ', this.messageService)
    return this.messageService.create(createMessageDto);
  }


}