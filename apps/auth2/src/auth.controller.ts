// import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
// // import { AuthGuard } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { AuthNoGoogleGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { SignInDto } from '../../../toolbox-gateway/src/app/dto/sign-in.dto';

import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local.auth-guard";
import { UserDocument } from "./users/models/user.schema";
import { JwtAuthGuard } from "./guards/jwt-auth-guard";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CurrentUser } from "./users/current-user.decorator";

@Controller('auth')
export class AuthController {  
  
  
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(
  //   @CurrentUser() user: UserDocument,
  //   @Res({passthrough : true}) response: Response
  // ) {
  //   await this.authService.login(user, response);
  //   response.send(user);
  // }

  @UseGuards(LocalAuthGuard)
  @MessagePattern('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({passthrough : true}) response: Response
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

}