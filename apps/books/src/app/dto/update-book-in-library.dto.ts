import { PartialType } from '@nestjs/mapped-types';
import { AddBookToLibraryDto } from './add-book-to-library.dto';

export class UpdateBookInLibraryDto extends PartialType(AddBookToLibraryDto) {
}
