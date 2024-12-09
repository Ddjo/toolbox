import { UserDto } from "@libs/common";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { RoomDto } from "./room.dto";

export class CreateMessageDto {

    @IsNotEmpty()
    @IsString()
    readonly room_id: RoomDto;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @Type(() => UserDto)
    @ValidateNested()
    readonly sender: UserDto
}
