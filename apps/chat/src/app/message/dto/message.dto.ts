import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ChatRoomDto } from "../../rooms/dto/chat-room.dto";
import { SenderDto } from "./sender.dto";
import { ObjectId } from "mongoose";

export class MessageDto {

    _id: ObjectId;

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @Type(() => SenderDto)
    @ValidateNested()
    readonly sender: SenderDto
}
