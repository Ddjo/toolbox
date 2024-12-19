import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_MESSAGE_SEEN_MESSAGE, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM } from '@constants';
import { RpcValidationFilter } from '@libs/common';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatMessageDto } from './dto/chat-message.dto';
import { GetMessagesForChatRoomDto } from './dto/get-messages-for-chat-room.dto';
import { MessageService } from './message.service';
import { SeenChatMessageDto } from './dto/seen-chat-message.dto';


@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE)
  async createMessage(@Payload() chatMessageDto: ChatMessageDto) {
    return await this.messageService.create(chatMessageDto);
  }

  @MessagePattern(CHAT_MESSAGE_SEEN_MESSAGE)
  async seenChatMessage(@Payload() seenChatMessageDto: SeenChatMessageDto) {
    return await this.messageService.seenChatMessage(seenChatMessageDto);
  }
  
  @MessagePattern(CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM)
  async findPreviousMessagesForChatRoom(@Payload() getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {

    return this.messageService.findPreviousMessagesForChatRoom(getMessagesForChatRoomDto);  
  }

}