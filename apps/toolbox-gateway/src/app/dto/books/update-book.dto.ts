import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsString } from 'class-validator';
import { AddBookDto, } from './add-book.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {

    @IsString()
    @IsMongoId()
    _id: string;
}
