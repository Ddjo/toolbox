import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AppService } from './app.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() payload : SignInDto) {
    console.log('sign in post ', payload) 
    // return this.authService.signIn(signInDto.userName, signInDto.password);
  }
}
