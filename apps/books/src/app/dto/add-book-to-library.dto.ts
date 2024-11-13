import { IsDate, IsNotEmpty, IsString } from "class-validator";
import {Type} from 'class-transformer';

export class AddBookToLibraryDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    author: string;

    rating: number;

    @IsDate()
    @Type(() => Date)
    releaseDate: Date
}
