import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomRepository } from '../rooms/rooms.repository';
import { ChatMessageDto } from './dto/chat-message.dto';
import { GetMessagesForChatRoomDto } from './dto/get-messages-for-chat-room.dto';
import { MessageRepository } from './message.repository';
import { SeenChatMessageDto } from './dto/seen-chat-message.dto';


@Injectable()
export class MessageService {


 constructor(
   private readonly roomRepository: RoomRepository,
  private readonly messageRepository: MessageRepository,
  @InjectConnection() private readonly connection: mongoose.Connection

 ) {}


  async create(chatMessageDto: ChatMessageDto) {

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try
    {
      const newMessage = await this.messageRepository
      .create( chatMessageDto,
        [
          {path: 'sender', select: ['_id', 'email']}, 
          {path: 'chatRoom', select: ['_id','name']}
        ]
      );

      await this.roomRepository.findOneAndUpdate(
        { _id: chatMessageDto.chatRoom._id}, 
        {
          $push : {
             messages : newMessage
          }
        },
        {},
      );

      transactionSession.commitTransaction();
      return newMessage;
    }
    catch(err)
    {
      transactionSession.abortTransaction();
      throw err; 
    }
    finally
    {
      transactionSession.endSession();
    }    
  }

  async findAllForChatRoom(getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {
    return this.messageRepository.find(
      { chatRoom: getMessagesForChatRoomDto.chatRoomId }, 
      { sort: { 'createdAt': -1 }, limit: getMessagesForChatRoomDto.messagesLimit }, 
      [ 
        {path: 'sender', select: ['_id', 'email']}, 
        {path: 'chatRoom', select: ['_id','name']}
      ]
     );
  }

  async findPreviousMessagesForChatRoom(getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {
    return this.messageRepository.find(
      { chatRoom: getMessagesForChatRoomDto.chatRoomId }, 
      {  }, 
      [ 
        {path: 'sender', select: ['_id', 'email']}, 
        {path: 'chatRoom', select: ['_id','name']}
      ],
      { createdAt: 'desc' },
      getMessagesForChatRoomDto.messagesLimit,
      getMessagesForChatRoomDto.skip
     )

    //  sort: { 'createdAt': -1 }, limit: getMessagesForChatRoomDto.messagesLimit
  }

  async seenChatMessage(seenChatMessageDto: SeenChatMessageDto) {
    return await this.messageRepository.findOneAndUpdate(
      {
        _id: seenChatMessageDto.chatMessageId
      },
      {
        $push : {
          seenBy : seenChatMessageDto.seenBy
       }
      },
      {}
    )
  }

  async removeAllForChatroom(chatRoomId: string) {
    return this.messageRepository.findOneAndDelete({ chatRoom: chatRoomId });
  }
}
