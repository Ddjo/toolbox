import { UserDto } from "@libs/common";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class AddBookDto {
    
    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsArray()
    @IsNotEmpty()
    authors: string[];
    
    @IsDate()
    @Type(() => Date)
    publishedDate: Date

    @Type(() => UserDto)
    @ValidateNested()
    readonly createdByUser: UserDto
}

