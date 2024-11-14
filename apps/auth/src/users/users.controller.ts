import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO, @Req() req: Request) {
    console.log('req', req)
    return this.userService.create(createUserDto);
  }
}
