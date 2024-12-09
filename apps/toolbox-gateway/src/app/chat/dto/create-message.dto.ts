import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {

    @IsNotEmpty()
    readonly room_id: string;

    @IsNotEmpty()
    readonly content: string;
}
