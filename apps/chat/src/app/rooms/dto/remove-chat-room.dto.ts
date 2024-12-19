import { IsMongoId, IsString } from "class-validator";

export class RemoveChatRoomDto {

    @IsString()
    @IsMongoId()
    _id: string;
}