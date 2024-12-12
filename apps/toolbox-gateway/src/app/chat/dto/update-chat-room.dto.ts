import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class UpdateChatRoomDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    members: string[];

    
    @ApiProperty()
    @IsArray()
    messages: string[];

}
