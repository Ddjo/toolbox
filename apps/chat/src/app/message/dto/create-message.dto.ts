import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserDTO } from "@libs/common";

export class CreateMessageDto {

    @IsNotEmpty()
    @IsString()
    readonly room_id: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @Type(() => UserDTO)
    @ValidateNested()
    readonly sender_id: UserDTO
}
