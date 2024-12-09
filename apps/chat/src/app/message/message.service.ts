import { Injectable } from '@nestjs/common';
import { MessageDocument } from './entities/message.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GetMessageDto } from './dto/get-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageRepository } from './message.repository';
import { RoomDto } from './dto/room.dto';


@Injectable()
export class MessageService {

  // constructor(
  //   @InjectModel(MessageDocument.name) private messageModel: Model<MessageDocument>,
  // ) { }

 constructor(private readonly messageRepository: MessageRepository) {}


  async create(createMessageDto: CreateMessageDto) {
    // const createdMessage = new this.messageModel({
    //   ...createMessageDto,
    // });

    // console.log('message service creating ', createdMessage)
    // return createdMessage.save();

    // const room: RoomDto ={
    //   _id : 'id-test',
    //   members: [{_id: ''}]
    // }
    
    return await this.messageRepository.create(createMessageDto);
    
  }
  
  // async findAll() {
    //   return this.messageRepository.find({}, { _id: 1, title: 1, authors: 1, publishedDate: 1 });
    // }

  async findAll(roomId: string, getMessageDto: GetMessageDto) {
    const query = {
      room_id: roomId,
    };

    if (getMessageDto.last_id) {
      query['_id'] = { $lt: getMessageDto.last_id };
    }

    return this.messageRepository.find(query, {});
  }

  // async findOne(getMessageDto: GetMessageDto) {
  //   return this.messageRepository.findOne({_id: getBookDto._id }, { _id: 1, title: 1, authors: 1, publishedDate: 1 });
  // }

  // async update(_id: string, updateBookDto: UpdateBookDto) {
  //   return this.messageRepository.findOneAndUpdate({ _id: updateBookDto._id}, 
  //     {$set: {...updateBookDto,
  //       updatedAt: new Date(),
  //       updatedByUser: updateBookDto.updatedByUser,
  //     }}, 
  //     { _id: 1, title: 1, authors: 1, publishedDate: 1 });
  // }

  // async remove(removeBookDto: RemoveBookDto) {
  //   return this.messageRepository.findOneAndDelete({ _id: removeBookDto._id});
  // }

}
