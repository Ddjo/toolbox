import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessageDto } from './dto/get-message.dto';
import { MessageRepository } from './message.repository';


@Injectable()
export class MessageService {


 constructor(private readonly messageRepository: MessageRepository) {}


  async create(createMessageDto: CreateMessageDto) {

    createMessageDto.sender.password = '';
    console.log('MessageService creating ', createMessageDto)
    
    return await this.messageRepository.create(
        {
          ...createMessageDto,
        chatRoom: {
          _id: createMessageDto.chatRoom._id,
          members: createMessageDto.chatRoom.members,
          name: createMessageDto.chatRoom.name
        },
      });
    
  }

  async findAll(roomId: string, getMessageDto: GetMessageDto) {
    const query = {
      room_id: roomId,
    };

    if (getMessageDto.last_id) {
      query['_id'] = { $lt: getMessageDto.last_id };
    }

    return this.messageRepository.find(query, {});
  }

}
