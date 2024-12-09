import { UserDto } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { RemoveRoomDto } from './dto/remove-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {

    constructor(
        private readonly roomRepository: RoomRepository
    ) { }

    async create(user: UserDto) {

        return await await this.roomRepository.create({
            members: [user],
            name: ''
          });;

    }

    async findAllForUser(user: UserDto) {
        return  this.roomRepository.find({ members: user }, {});
    }

    async remove(removeRoomDto: RemoveRoomDto) {
        return this.roomRepository.findOneAndDelete({ _id: removeRoomDto._id});
    }

    async update(updateChatRoomDto: UpdateChatRoomDto) {

        return await this.roomRepository.findOneAndUpdate(
            { _id: updateChatRoomDto._id}, 
            {$set: updateChatRoomDto},
            {_id: 1, name: 1, members: 1}
        );
    }
}
