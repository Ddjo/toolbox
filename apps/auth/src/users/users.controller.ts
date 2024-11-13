import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../guards/jwt-auth-guard";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserDocument } from "./models/user.schema";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller('users')
export class UsersController {
    constructor(private usersService : UsersService) {}

    // @Post()
    // async createUser(@Body() createUserDto: CreateUserDTO) {
    //     return this.usersService.create(createUserDto);
    // }

    @MessagePattern('create-user')
    async createUser(@Payload() data: CreateUserDTO) {
        return this.usersService.create(data);
    }

    @Get()
    async getUsers() {
        return this.usersService.find();
    }
}