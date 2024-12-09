import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { UserDocument } from './entities/user.entity';
import { UsersService } from './user.service';
import { CurrentUser, usersMocks } from '@libs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: UserDocument) {

    return {_id : user._id, email: user.email};
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@CurrentUser() user: UserDocument) {
    // to remove
    return [...usersMocks.map(user => {return {_id : user._id, email: user.email}}), {_id : user._id, email: user.email}]
  }

}