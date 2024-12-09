import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {

    @ApiProperty()
    @IsNotEmpty()
    readonly room_id: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;
}
