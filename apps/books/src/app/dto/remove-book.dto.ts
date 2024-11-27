import { IsMongoId, IsString } from "class-validator";

export class RemoveBookDto {

    @IsString()
    @IsMongoId()
    id: string;
}