
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
    return this.chatService.getChatRoomsForUser(user);
  }

    
  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  getMessagesForChatroom(@Param('id') id: string) { 
    return this.chatService.getMessagesForChatRoom(id);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createChatRoom( @CurrentUser() user: UserDto) {
    return this.chatService.createChatRoom(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateChatRoom(@Param('id') id: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatService.updateChatRoom(id, updateChatRoomDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeChatRoom(@Param('id') id: string) {
    return this.chatService.removeChatRoom(id);
  }

}
