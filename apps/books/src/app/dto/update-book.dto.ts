import { UserDTO } from '@libs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AddBookDto, } from './add-book.dto';

export class UpdateBookDto extends PartialType(AddBookDto) {

    @IsString()
    @IsMongoId()
    _id: string;

    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsArray()
    @IsNotEmpty()
    authors: string[];
    
    @IsDate()
    @Type(() => Date)
    publishedDate: Date

    @Type(() => UserDTO)
    @ValidateNested()
    readonly updatedByUser: UserDTO

}
