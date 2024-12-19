import { UserDto } from "@libs/common";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongoose";
import { ChatRoomDto } from "../../rooms/dto/chat-room.dto";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class ChatMessageDto {

    _id: ObjectId;

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly sender: UserWithoutPasswordDto

    @IsArray()
    seenBy:  UserDto[];
}
