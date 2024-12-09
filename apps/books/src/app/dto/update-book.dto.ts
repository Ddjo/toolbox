import { UserDto } from '@libs/common';
import { Type } from 'class-transformer';
import { IsMongoId, IsString, ValidateNested } from 'class-validator';
import { AddBookDto, } from './add-book.dto';

export class UpdateBookDto extends AddBookDto {

    @IsString()
    @IsMongoId()
    _id: string;

    @Type(() => UserDto)
    @ValidateNested()
    readonly updatedByUser: UserDto

}
