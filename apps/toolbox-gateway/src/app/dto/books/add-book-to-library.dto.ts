import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";

export class AddBookToLibraryDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsArray()
    @IsNotEmpty()
    authors: string[];

    @IsDate()
    @Type(() => Date)
    publishedDate: Date
}
