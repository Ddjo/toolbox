import { UserDto } from '@libs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';

export class RoomDto {

    @ApiProperty()
    @IsMongoId()
    @IsNotEmpty()
    _id!: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    // @ValidateIf(o => o.type != RoomType.PERSONAL)
    name: string;

    @ApiProperty({ required: true })
    @IsArray()
    @ArrayNotEmpty()
    members: mongoose.Schema.Types.ObjectId[];

    // @ApiProperty({ required: true, default: RoomType.PERSONAL })
    // @IsEnum(RoomType)
    // @ValidateIf(o => o.type)
    // type: RoomType;
}
