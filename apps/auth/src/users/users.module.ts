import { DB_USERS_DOCUMENT } from '@constants';
import { DatabaseModule, LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { UserSchema } from './entities/user.entity';
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
import { UsersService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: DB_USERS_DOCUMENT, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository]
})
export class UsersModule {}
