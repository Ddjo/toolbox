import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
import { UserCredentialsDTO } from "./dto/user-credentials";
import { UsersService } from "./users.service";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CurrentUser } from "./current-user.decorator";
import { UserDocument } from "./models/user.schema";

@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService) {}

    @MessagePattern('create-user')
    async createUser(@Payload() data: UserCredentialsDTO) {
        return this.usersService.create(data);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getCurrentUser(@CurrentUser() user: UserDocument) {
        return user;
    }
}