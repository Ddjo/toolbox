import { CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_UPDATE_CHAT_ROOM } from '@constants';
import { RpcValidationFilter } from '@libs/common';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatRoomDto } from './dto/chat-room.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { GetAllChatRoomsForUserDto } from './dto/get-all-chat-rooms-for-user.dto';
import { RemoveChatRoomDto } from './dto/remove-chat-room.dto';
import { RoomsService } from './rooms.service';

@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  @MessagePattern(CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER)
  async findAllForUser(@Payload() getAllChatRoomsForUserDto: GetAllChatRoomsForUserDto) {
    return this.roomsService.findAllForUser(getAllChatRoomsForUserDto);
  }

  @MessagePattern(CHAT_ROOM_CREATE_CHAT_ROOM)
  async create(@Payload() createChatRoomDto: CreateChatRoomDto) {
    return this.roomsService.create(createChatRoomDto);
  }

  @MessagePattern(CHAT_ROOM_DELETE_CHAT_ROOM)
  async remove(@Payload() removeRoomDto: RemoveChatRoomDto) {
    return this.roomsService.remove(removeRoomDto);  
  }

  @MessagePattern(CHAT_ROOM_UPDATE_CHAT_ROOM)
  async addMemberToChatRoom(@Payload() chatRoomDto: ChatRoomDto) {
    return this.roomsService.update(chatRoomDto);  
  }

}
