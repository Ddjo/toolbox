import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth-guard';
// import { CurrentUser } from './current-user.decorator';
import { UserDocument } from './users/entities/user.entity';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth-guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@libs/common';
import { AUTH_AUTHENTICATE } from '@constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {

    const token = await this.authService.login(user, response);
 
    const res = {
      _id: user._id,
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
  @MessagePattern(AUTH_AUTHENTICATE)
  async authenticate(@Payload() data: any) {
    return data.user;
  }


}
