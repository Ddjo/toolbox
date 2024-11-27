import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class AddBookDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsArray()
    @IsNotEmpty()
    authors: string[];

    @IsDate()
    @Type(() => Date) 
    publishedDate: string
}
