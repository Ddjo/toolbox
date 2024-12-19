import { UserDto } from '@libs/common';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { ChatMessageDto } from '../../message/dto/chat-message.dto';

export class ChatRoomDto {

    @IsMongoId()
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    name: string;

    @IsArray()
    members: UserDto[];

    @IsArray()
    messages: ChatMessageDto[];

}
