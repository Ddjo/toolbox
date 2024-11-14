import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserDocument, UserSchema } from './models/user.schema';
import { UserRepository } from './user.repository';
import { DatabaseModule, LoggerModule } from '@libs/common';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository]
})
export class UsersModule {}
