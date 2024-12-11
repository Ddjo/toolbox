import { UserDto } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class ChatRoomDto {

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    _id!: ObjectId;

    @ApiProperty()
    @IsString()
    // @IsNotEmpty()
    // @ValidateIf(o => o.type != RoomType.PERSONAL)
    name: string;

    @ApiProperty({ required: true })
    @IsArray()
    @ArrayNotEmpty()
    members: UserDto[];

    // @ApiProperty({ required: true, default: RoomType.PERSONAL })
    // @IsEnum(RoomType)
    // @ValidateIf(o => o.type)
    // type: RoomType;
}
