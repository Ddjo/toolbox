import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UserDto {

    @IsMongoId()
    @IsNotEmpty()
    _id!: mongoose.Schema.Types.ObjectId;

    @IsEmail()
    email!: string;
 
    @IsString()
    @IsNotEmpty()     
    password!: string;
}
