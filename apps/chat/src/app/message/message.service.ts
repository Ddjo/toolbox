import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomRepository } from '../rooms/rooms.repository';
import { GetMessageDto } from './dto/get-message.dto';
import { MessageDto } from './dto/message.dto';
import { MessageRepository } from './message.repository';


@Injectable()
export class MessageService {


 constructor(
   private readonly roomRepository: RoomRepository,
  private readonly messageRepository: MessageRepository,
  @InjectConnection() private readonly connection: mongoose.Connection

 ) {}


  async create(messageDto: MessageDto) {

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try
    {

      const newMessage = await this.messageRepository.create(messageDto);
      
      await this.roomRepository.findOneAndUpdate(
        { _id: messageDto.chatRoom._id}, 
        {$set: {
          ...messageDto.chatRoom,
          messages : [...messageDto.chatRoom.messages, newMessage]
        }},
        {}
      );
    
      transactionSession.commitTransaction();
      return newMessage;
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

  async findAllForChatRoom(chatRoomId: string) {
    return this.messageRepository.find(
      { chatRoom: chatRoomId }, 
      {}, 
      [ 
        {path: 'sender', select: '_id, email'}, 
        {path: 'chatRoom', select: '_id, name'}
      ]
     );
  }

  async findAll(roomId: string, getMessageDto: GetMessageDto) {
    // const query = {
    //   room_id: roomId,
    // };

    // if (getMessageDto.last_id) {
    //   query['_id'] = { $lt: getMessageDto.last_id };
    // }

    // return this.messageRepository.find(query, {});
  }

  async removeAllForChatroom(chatRoomId: string) {
    return this.messageRepository.findOneAndDelete({ chatRoom: chatRoomId });
  }
}
