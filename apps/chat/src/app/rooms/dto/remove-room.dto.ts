import { IsMongoId, IsString } from "class-validator";

export class RemoveRoomDto {

    @IsString()
    @IsMongoId()
    _id: string;
}