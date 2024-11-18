import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth-guard';
// import { CurrentUser } from './current-user.decorator';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@libs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'login' })
  // @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {

    console.log('auth2 AuthController - login recieved - user : ', user)

    const token = await this.authService.login(user, response);

    const res = {
      email: user.email,
      token: token.token
    }

    response.send(res);
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(response);
  }
  
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }

}
