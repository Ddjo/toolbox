import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserRepository } from './user.repository';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.userRepository.create({
      ...createUserDto,
      password: await bcryptjs.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.userRepository.findOne({ email: createUserDto.email }, {});
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email }, {});
    const passwordIsValid = await bcryptjs.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.userRepository.findOne(getUserDto, {});
  }

  async getAll() {
    return this.userRepository.find({}, {_id: 1, email: 1})
  }
}
