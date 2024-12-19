import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ChatRoomDto } from "./chat-room.dto";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class TypingMessageDto {
    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly sender: UserWithoutPasswordDto;

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;
 
}
