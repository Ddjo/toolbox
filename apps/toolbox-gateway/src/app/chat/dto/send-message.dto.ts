import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { ChatRoomDto } from "./chat-room.dto";
import { SenderDto } from "./sender.dto";

export class SendMessageDto {

    @IsNotEmpty()
    @Type(() => ChatRoomDto)
    @ValidateNested()
    readonly chatRoom: ChatRoomDto;

    @IsNotEmpty()
    @Type(() => SenderDto)
    @ValidateNested()
    readonly sender: SenderDto

    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;
}

