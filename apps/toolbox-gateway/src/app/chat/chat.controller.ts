
// import { SignInDto } from './dto/sign-in.dto';

import { CurrentUser, JwtAuthGuard, UserDto } from "@libs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from "./chat.service";
import { UpdateChatRoomDto } from "./dto/update-chat-room.dto";
import { UserWithoutPasswordDto } from "./dto/user-without-password.dto";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  
  @Get()
  @UseGuards(JwtAuthGuard)
  getChatRoomsForUser(
    @CurrentUser() user: UserDto, 
    @Query('messages-limit')messagesLimit : string
  ) { 
    return this.chatService.getChatRoomsForUser(user, +messagesLimit);
  }

    
  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  findPreviousMessagesForChatRoom(
    @Param('id') id: string,
    @Query('skip') skip : string,
    @Query('messages-limit') messagesLimit : string
  ) { 
    return this.chatService.findPreviousMessagesForChatRoom(id, +skip, +messagesLimit);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  startChatWithUser( @CurrentUser() user: UserDto, @Body() withUser: UserWithoutPasswordDto) {
    return this.chatService.startChatWithUser(user, withUser);
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
