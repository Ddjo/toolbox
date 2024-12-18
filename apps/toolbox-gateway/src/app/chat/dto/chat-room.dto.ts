import { UserDto } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

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
    members: UserDto[];

}
