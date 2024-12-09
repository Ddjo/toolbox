
// import { SignInDto } from './dto/sign-in.dto';

import { CurrentUser, JwtAuthGuard, UserDto } from "@libs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from "./chat.service";
import { UpdateChatRoomDto } from "./dto/update-chat-room.dto";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  
  @Get()
  @UseGuards(JwtAuthGuard)
  getChatRoomsForUser(@CurrentUser() user: UserDto) { 
    return this.chatService.getAllForUser(user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create( @CurrentUser() user: UserDto) {
    return this.chatService.create(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatService.update(id, updateChatRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }

}
