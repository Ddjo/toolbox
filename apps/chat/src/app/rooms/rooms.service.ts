import { UserDto } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MessageRepository } from '../message/message.repository';
import { ChatRoomDto } from './dto/chat-room.dto';
import { RemoveRoomDto } from './dto/remove-room.dto';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly messageRepository: MessageRepository,
        @InjectConnection() private readonly connection: mongoose.Connection
    ) { }

    async create(user: UserDto) {

        return await this.roomRepository.create(
            {
                members: [user],
                messages: [],
                name: ''
            }, 
            {path: 'members', select: '_id, email'});

    }

    async findAllForUser(user: UserDto) {
        return this.roomRepository.find(
            { members: user }, 
            {}, 
            [
                // {path: 'members', select: '_id, email'}, 
                {path: 'messages', select: '_id, content, sender, createdAt, updatedAt'}
            ]
        );
    }

    async remove(removeRoomDto: RemoveRoomDto) {

        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();

        try
        {

            // Remove messages
            this.messageRepository.findOneAndDelete({ chatRoom: removeRoomDto._id });

            const result = this.roomRepository.findOneAndDelete({_id: removeRoomDto._id});
        
            transactionSession.commitTransaction();
            return result;
        }
        catch(err)
        {
          transactionSession.abortTransaction();
        }
        finally
        {
          transactionSession.endSession();
        }
    }

    async update(updateChatRoomDto: ChatRoomDto) {

        // console.log('update updateChatRoomDto : ', updateChatRoomDto)

        return await this.roomRepository.findOneAndUpdate(
            { _id: updateChatRoomDto._id}, 
            {$set: updateChatRoomDto},
            {_id: 1, name: 1, members: 1}, 
            [{path: 'members', select: '_id, email'}, {path: 'messages', select: '_id, content, sender, createdAt, updatedAt'}]
        );
    }
}
