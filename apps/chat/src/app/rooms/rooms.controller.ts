import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomsService } from './rooms.service';


@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService,
    // private readonly messageService: MessageService,
  ) { }

  @Post()
  create(@Request() req, @Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(req.user._id.toString(), createRoomDto);
  }

  @Get()
  getByRequest(@Request() req) {
    return this.roomsService.getByRequest(req.user._id.toString());
  }

  // @Get(':id/chats')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiParam({ name: 'id', required: true })
  // getChats(@Param('id') id, @Query() dto: GetChatDto) {
  //   return this.messageService.findAll(id, new getles(dto));
  // }
}
