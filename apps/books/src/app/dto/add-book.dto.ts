import { IsArray, IsDate, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class AddBookDto {
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
    @IsNotEmpty()
    createdByUserId: ObjectId;


}
