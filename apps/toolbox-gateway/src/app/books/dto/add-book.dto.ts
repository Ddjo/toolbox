import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class AddBookDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    authors: string[];

    @ApiProperty()
    @IsDate()
    @Type(() => Date) 
    publishedDate: string
}
