import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ChatRoomDto } from "./chat-room.dto";
import { SenderDto } from "./sender.dto";

export class CreateMessageDto {

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
