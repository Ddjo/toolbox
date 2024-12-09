import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class UpdateChatRoomDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    _id: ObjectId;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    members: string[];

}
