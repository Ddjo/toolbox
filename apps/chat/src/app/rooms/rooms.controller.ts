import { CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_UPDATE_CHAT_ROOM } from '@constants';
import { RpcValidationFilter, UserDto } from '@libs/common';
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChatRoomDto } from './dto/chat-room.dto';
import { RemoveRoomDto } from './dto/remove-room.dto';
import { RoomsService } from './rooms.service';

@UsePipes(new ValidationPipe())
@UseFilters(new RpcValidationFilter())
@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  @MessagePattern(CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER)
  async findAllForUser(@Payload() user: UserDto) {
    return this.roomsService.findAllForUser(user);
  }

  @MessagePattern(CHAT_ROOM_CREATE_CHAT_ROOM)
  async create(@Payload() user: UserDto) {
    return this.roomsService.create(user);
  }

  @MessagePattern(CHAT_ROOM_DELETE_CHAT_ROOM)
  async remove(@Payload() removeRoomDto: RemoveRoomDto) {
    return this.roomsService.remove(removeRoomDto);  
  }

  @MessagePattern(CHAT_ROOM_UPDATE_CHAT_ROOM)
  async addMemberToChatRoom(@Payload() chatRoomDto: ChatRoomDto) {
    return this.roomsService.update(chatRoomDto);  
  }

}
