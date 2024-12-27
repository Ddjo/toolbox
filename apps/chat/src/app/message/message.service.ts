import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { RoomRepository } from '../rooms/rooms.repository';
import { AddViewerToChatMessageDto } from './dto/add-viewer-to-chat-message.dto';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { GetMessagesForChatRoomDto } from './dto/get-messages-for-chat-room.dto';
import { MessageRepository } from './message.repository';


@Injectable()
export class MessageService {


 constructor(
   private readonly roomRepository: RoomRepository,
  private readonly messageRepository: MessageRepository,
  @InjectConnection() private readonly connection: mongoose.Connection

 ) {}


  async create(createChatMessageDto: CreateChatMessageDto) {

    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    try
    {
      const newMessage = await this.messageRepository
      .create( {
        ...createChatMessageDto,
        chatRoomId: createChatMessageDto.chatRoomId,
        views: [{user: createChatMessageDto.sender, viewedAt: new Date()}]
      },
        [
          {path: 'sender', select: ['_id', 'email']}, 
          {
            path: 'views', 
            select: ['user', 'viewedAt'],
            populate : [
              {
                path: 'user',
                select: ['_id', 'email']
              },
            ],
          }
        ]
      );

      await this.roomRepository.findOneAndUpdate(
        { _id: createChatMessageDto.chatRoomId}, 
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
        {
          path: 'views', 
          select: ['user', 'viewedAt'],
          populate : [
            {
              path: 'user',
              select: ['_id', 'email']
            },
          ],
        }
      ]
     );
  }

  async findPreviousMessagesForChatRoom(getMessagesForChatRoomDto: GetMessagesForChatRoomDto) {
    return this.messageRepository.find(
      { chatRoom: getMessagesForChatRoomDto.chatRoomId }, 
      {  }, 
      [ 
        {path: 'sender', select: ['_id', 'email']}, 
        {
          path: 'views', 
          select: ['user', 'viewedAt'],
          populate : [
            {
              path: 'user',
              select: ['_id', 'email']
            },
          ],
        }
      ],
      { createdAt: 'desc' },
      getMessagesForChatRoomDto.messagesLimit,
      getMessagesForChatRoomDto.skip
     )

    //  sort: { 'createdAt': -1 }, limit: getMessagesForChatRoomDto.messagesLimit
  }

  async addViewerToChatMessage(addViewerToChatMessageDto: AddViewerToChatMessageDto) {
    return await this.messageRepository.findOneAndUpdate(
      {
        _id: addViewerToChatMessageDto.chatMessageId
      },
      {
        $push : {
          views : addViewerToChatMessageDto.view
       }
      },
      {},
      [ 
        {path: 'sender', select: ['_id', 'email']}, 
        {
          path: 'views', 
          select: ['user', 'viewedAt'],
          populate : [
            {
              path: 'user',
              select: ['_id', 'email']
            },
          ],
        }
      ],
    );
  }

  async removeAllForChatroom(chatRoomId: string) {
    return this.messageRepository.findOneAndDelete({ chatRoom: chatRoomId });
  }
}
