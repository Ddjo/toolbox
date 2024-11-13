import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { Request } from "express";
import { Tokenpayload } from "../interface/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) =>
                  request?.cookies?.Authentication ||
                  request?.Authentication ||
                  request?.headers.Authentication,
              ]),
              secretOrKey: configService.get('JWT_SECRET'),
        })
    }
 
    // async validate({userId} : Tokenpayload) {
    //     return this.userService.getUser({_id: userId});
    // }
}
