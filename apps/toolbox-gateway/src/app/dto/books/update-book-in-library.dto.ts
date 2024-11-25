import { PartialType } from '@nestjs/mapped-types';
import { AddBookToLibraryDto } from './add-book-to-library.dto';
import { IsNumber } from 'class-validator';

export class UpdateBookInLibraryDto extends PartialType(AddBookToLibraryDto) {

    @IsNumber()
    id: number;
}
