import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Tokenpayload } from './interface/token-payload.interface';
import { UserDocument } from './users/models/user.schema';


@Injectable()
export class AuthService {
    constructor(
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      ) {}
    
      // async signIn(
      //   username: string,
      //   pass: string,
      // ): Promise<{ access_token: string }> {
      //   const user = await this.usersService.findOne(username);
      //   if (user?.password !== pass) {
      //     throw new UnauthorizedException();
      //   }
      //   const payload = { sub: user.userId, username: user.username };
      //   return {
      //     access_token: await this.jwtService.signAsync(payload),
      //   };
      // }

      async login(user: UserDocument, response: Response) {
        const tokenPayload: Tokenpayload = {
          userId: user._id.toString()
        };

        // Calculate the token expiration time by adding seconds to the current date
        const expires = new Date();
        expires.setSeconds(
          expires.getSeconds() + this.configService.get('JWT_EXPIRATION')
        );

        const token = this.jwtService.sign(tokenPayload);

        response.cookie('Authentication', token, {
          expires: expires,
          httpOnly: true
        })
        
      }
}
