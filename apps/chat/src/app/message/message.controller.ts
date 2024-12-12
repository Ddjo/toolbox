import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM } from '@constants';
import { ArgumentsHost, Catch, Controller, ExceptionFilter, HttpException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MessageService } from './message.service';
import { MessageDto } from './dto/message.dto';
import { RoomsService } from '../rooms/rooms.service';
import { RpcValidationFilter } from '@libs/common';


@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE)
  async createMessage(@Payload() messageDto: MessageDto) {

    console.log('  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE) : ', messageDto);
    
    return await this.messageService.create(messageDto);
  }

  
  @MessagePattern(CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM)
  async getMessagesForChatRoom(@Payload() chatRoomId: string) {
    return this.messageService.findAllForChatRoom(chatRoomId);  
  }

}