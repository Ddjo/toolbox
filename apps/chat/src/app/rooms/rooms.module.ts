import { DatabaseModule, UserDocument, UserSchema } from '@libs/common';
import { Module } from '@nestjs/common';
import { RoomDocument, RoomSchema } from './entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';
// import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: RoomDocument.name, schema: RoomSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
    ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomRepository],
})
export class RoomsModule { }
