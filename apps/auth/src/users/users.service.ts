import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { USER_EMAIL_ALREADY_EXISTS } from '@constants';

// This should be a real class/interface representing a user entity
export type User = {
    userId: number;
    username: string;
    password: string;
};

@Injectable()
export class UsersService {
  private readonly users : User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  constructor(private userRepository: UserRepository) {}
 
  async create(createUserDto :CreateUserDTO) {

    try {
      await this.userRepository.findOne({email : createUserDto.email});
    } catch (err) {
      return this.userRepository.create({
        ...createUserDto,
        password: await bcryptjs.hash(createUserDto.password, 10)
      })
    }
    
    return USER_EMAIL_ALREADY_EXISTS;
  }

  async find() {
    return this.userRepository.find({});
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({email});
    const passwordIsValid = await bcryptjs.compare(password, user.password);

    if (!passwordIsValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}