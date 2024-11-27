import { IsMongoId, IsString } from "class-validator";

export class RemoveBookDto {

    @IsString()
    @IsMongoId()
    _id: string;
}