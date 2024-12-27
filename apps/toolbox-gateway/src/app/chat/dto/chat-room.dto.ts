import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { SendChatMessageDto } from './send-chat-message.dto';
import { UserWithoutPasswordDto } from './user-without-password.dto';

export class ChatRoomDto {

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    _id!: ObjectId;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: true })
    @IsArray()
    members: UserWithoutPasswordDto[];

    @ApiProperty()
    @IsArray()
    messages: SendChatMessageDto[];

    typingUsers: UserWithoutPasswordDto[];

}
