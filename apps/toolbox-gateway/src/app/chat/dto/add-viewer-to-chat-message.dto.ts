import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, ValidateNested } from "class-validator";
import { ChatMessageViewDto } from "./chat-message-view.dto";

export class AddViewerToChatMessageDto
 {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    readonly chatMessageId: string;
    
    @IsNotEmpty()
    @Type(() =>  ChatMessageViewDto)
    @ValidateNested()
    readonly view: ChatMessageViewDto;
}

