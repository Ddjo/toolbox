import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ChatRoomDto } from "./chat-room.dto";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class SendChatMessageDto {

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;

    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly sender: UserWithoutPasswordDto

    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;
}

