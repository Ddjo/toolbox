import { UserDto } from '@libs/common';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RemoveRoomDto } from './dto/remove-room.dto';
import { RoomsService } from './rooms.service';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { CHAT_ROOM_CREATE_CHAT_ROOM, CHAT_ROOM_DELETE_CHAT_ROOM, CHAT_ROOM_GET_ALL_CHAT_ROOMS_FOR_USER, CHAT_ROOM_UPDATE_CHAT_ROOM } from '@constants';

@UsePipes(new ValidationPipe())
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
  async addMemberToChatRoom(@Payload() updateChatRoomDto: UpdateChatRoomDto) {
    return this.roomsService.update(updateChatRoomDto);  
  }

}
