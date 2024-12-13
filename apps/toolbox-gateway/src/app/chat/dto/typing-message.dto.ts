import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ChatRoomDto } from "./chat-room.dto";
import { SenderDto } from "./sender.dto";

export class TypingMessageDto {
    @IsNotEmpty()
    @Type(() => SenderDto)
    @ValidateNested()
    readonly sender: SenderDto;

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;
 
}
