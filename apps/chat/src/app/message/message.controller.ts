import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM } from '@constants';
import { RpcValidationFilter } from '@libs/common';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GetMessagesForChatRoomDto } from './dto/get-messages-for-chat-room.dto';
import { MessageDto } from './dto/message.dto';
import { MessageService } from './message.service';


@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE)
  async createMessage(@Payload() messageDto: MessageDto) {
    return await this.messageService.create(messageDto);
  }

  
  @MessagePattern(CHAT_ROOM_GET_MESSAGES_FOR_CHATROOM)
  async getMessagesForChatRoom(@Payload() getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {

    return this.messageService.findAllForChatRoom(getMessagesForChatRoomDto);  
  }

}