import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth-guard';
import { UserDocument } from './models/user.schema';
import { UsersService } from './user.service';
import { CurrentUser } from '@libs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}