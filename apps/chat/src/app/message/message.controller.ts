import { CHAT_MESSAGE_CREATE_MESSAGE, CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED, CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM } from '@constants';
import { RpcValidationFilter } from '@libs/common';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AddViewerToChatMessageDto } from './dto/add-viewer-to-chat-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { GetMessagesForChatRoomDto } from './dto/get-messages-for-chat-room.dto';
import { MessageService } from './message.service';


@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
  ) {}

  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE)
  async createMessage(@Payload() createChatMessageDto: CreateChatMessageDto) {
    return await this.messageService.create(createChatMessageDto);
  }

  @MessagePattern(CHAT_MESSAGE_EMIT_SET_MESSAGE_AS_VIEWED)
  async addViewerToChatMessage(@Payload() addViewerToChatMessageDto: AddViewerToChatMessageDto) {
    return await this.messageService.addViewerToChatMessage(addViewerToChatMessageDto);
  }
  
  @MessagePattern(CHAT_ROOM_GET_PREVIOUS_MESSAGES_FOR_CHATROOM)
  async findPreviousMessagesForChatRoom(@Payload() getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {

    return this.messageService.findPreviousMessagesForChatRoom(getMessagesForChatRoomDto);  
  }

}