import { UserDto } from '@libs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RemoveRoomDto } from './dto/remove-room.dto';
import { RoomsService } from './rooms.service';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
  ) { }

  @MessagePattern('get-all-chat-rooms-for-user')
  async findAllForUser(@Payload() user: UserDto) {
    return this.roomsService.findAllForUser(user);
  }

  @MessagePattern('create-chat-room')
  async create(@Payload() user: UserDto) {
    return this.roomsService.create(user);
  }

  @MessagePattern('remove-chat-room')
  async remove(@Payload() removeRoomDto: RemoveRoomDto) {
    return this.roomsService.remove(removeRoomDto);  
  }

  @MessagePattern('update-chat-room')
  async addMemberToChatRoom(@Payload() updateChatRoomDto: UpdateChatRoomDto) {
    return this.roomsService.update(updateChatRoomDto);  
  }

}
