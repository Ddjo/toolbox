import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, ValidateNested } from "class-validator";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class SeenChatMessageDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    readonly chatMessageId: string;
    
    @IsNotEmpty()
    @Type(() =>  UserWithoutPasswordDto)
    @ValidateNested()
    readonly seenBy: UserWithoutPasswordDto;
}

