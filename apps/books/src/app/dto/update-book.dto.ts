import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { AddBookDto, } from './add-book.dto';
import { ObjectId } from 'mongoose';

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
    @IsString()
    publishedDate: Date

    @IsString()
    @IsMongoId()
    updatedByUserId: ObjectId;
}
