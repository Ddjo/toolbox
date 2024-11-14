import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../users/user.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Tokenpayload } from '../interface/token-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.Authentication, // JWT in a cookie
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: Tokenpayload) {
    return this.userService.getUser({ _id: userId });  //We will define 'getUser' in the user service later; for now, let's just declare it
  }
}
