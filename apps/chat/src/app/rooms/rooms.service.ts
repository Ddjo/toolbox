import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MessageRepository } from '../message/message.repository';
import { ChatRoomDto } from './dto/chat-room.dto';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { GetAllChatRoomsForUserDto } from './dto/get-all-chat-rooms-for-user.dto';
import { RemoveChatRoomDto } from './dto/remove-chat-room.dto';
import { RoomRepository } from './rooms.repository';

@Injectable()
export class RoomsService {

    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly messageRepository: MessageRepository,
        @InjectConnection() private readonly connection: mongoose.Connection
    ) { }

    async create(createChatRoomDto: CreateChatRoomDto) {

        return await this.roomRepository.create(
            {
                members: [createChatRoomDto.creator, createChatRoomDto.withUser],
                messages: [],
                name: ''
            }, 
            [
                {path: 'members', select: ['_id', 'email']}
            ]);

    }

    async findAllForUser( getAllChatRoomsForUserDto: GetAllChatRoomsForUserDto) {
       // Fetch chat rooms for a specific user
        const chatRooms = await this.roomRepository.find(
            { 
                members: getAllChatRoomsForUserDto.user // Filter chat rooms where the user is a member
            }, 
            {}, // No specific projection for the main query
            [
            // Populate the 'members' field to include only _id and email of each member
            { 
                path: 'members', select: ['_id', 'email'] 
            },
            // Populate the 'messages' field with the following options:
            {
                path: 'messages',
                options: { 
                    sort: { 'createdAt': -1 }, // Sort messages by createdAt in descending order (newest first)
                    limit: getAllChatRoomsForUserDto.messagesLimit // Limit the number of messages per chat room
                }, 
                select: ['_id', 'content', 'sender', 'seenBy', 'createdAt', 'updatedAt'], // Select specific fields from each message
                populate: [
                    { 
                        path: 'sender', // Populate the sender of each message
                        select: ['_id', 'email'] // Include only _id and email for the sender
                    }, {
                        path: 'seenBy', // Populate the sender of each message
                        select: ['_id', 'email'] // Include only _id and email for the sender
                    }
                ]
            },
            ],
        );
        
        // Add a `totalMessages` field for each chat room by calculating the total number of messages
        const resultsWithTotalMessages = await Promise.all(
            chatRooms.map(async (doc: any) => {
                // Fetch the total number of messages for the current chat room
                const totalMessages = await this.roomRepository
                    .findOne({ _id: doc._id }, { messages: 1 }) // Query to fetch only the messages field
                    .then((res) => res?.messages?.length || 0); // Count the number of messages or default to 0 if undefined

                // Return the chat room document with the additional totalMessages field
                return {
                    ...doc, // Spread the original chat room document
                    totalMessages, // Add the calculated totalMessages field
                };
            })
        );
        
        // Return the enriched results with totalMessages
        return resultsWithTotalMessages;
        
    }

    async remove(removeRoomDto: RemoveChatRoomDto) {

        const transactionSession = await this.connection.startSession();
        transactionSession.startTransaction();

        try
        {

            // Remove messages
            this.messageRepository.deleteMany({ chatRoom: removeRoomDto });

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
            [
                {path: 'members', select: ['_id', 'email']}, 
                {path: 'messages', select: ['_id', 'content', 'sender', 'createdAt', 'seenBy', 'updatedAt'], 
                    populate: [
                        {path: 'sender', select: ['_id', 'email']}, 
                        {path: 'seenBy', select: ['_id', 'email']},],
                    
                },
            ]
        );
    }
}
