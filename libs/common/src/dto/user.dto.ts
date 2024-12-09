import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UserDto {

    @IsMongoId()
    @IsNotEmpty()
    _id!: ObjectId;

    @IsEmail()
    email!: string;
 
    @IsString()
    @IsNotEmpty()     
    password!: string;
}
