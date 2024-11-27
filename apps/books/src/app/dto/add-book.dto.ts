import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";

export class AddBookDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsArray()
    @IsNotEmpty()
    authors: string[];

    @IsDate()
    @IsString()
    publishedDate: string
}
