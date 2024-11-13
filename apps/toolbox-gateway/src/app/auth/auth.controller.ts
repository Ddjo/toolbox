// import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
// // import { AuthGuard } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { AuthNoGoogleGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { SignInDto } from '../../../toolbox-gateway/src/app/dto/sign-in.dto';

import { Body, Controller, Post } from "@nestjs/common";
import { UserCredentialsDTO } from "../dto/user-credentials";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {  
  
  
  constructor(private authService: AuthService) {}

  @Post('create-user')
  createUser(@Body() createUserDto: UserCredentialsDTO) {
    return this.authService.createUser(createUserDto);
  }   

  @Post('login')
  async login(@Body() createUserDto: UserCredentialsDTO) {
    return this.authService.login(createUserDto);
  }

}