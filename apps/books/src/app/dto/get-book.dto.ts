import { IsMongoId, IsString } from 'class-validator';

export class GetBookDto{

    @IsString()
    @IsMongoId()
    _id: string;
}
