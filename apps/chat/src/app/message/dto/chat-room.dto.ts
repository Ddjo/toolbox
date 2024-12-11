import { UserDto } from '@libs/common';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class ChatRoomDto {

    @IsMongoId()
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsString()
    // @ValidateIf(o => o.type != RoomType.PERSONAL)
    name: string;

    @IsArray()
    @ArrayNotEmpty()
    members: UserDto[];

    // @ApiProperty({ required: true, default: RoomType.PERSONAL })
    // @IsEnum(RoomType)
    // @ValidateIf(o => o.type)
    // type: RoomType;
}
