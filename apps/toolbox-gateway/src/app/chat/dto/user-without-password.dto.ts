import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class UserWithoutPasswordDto {
    @IsMongoId()
    @IsNotEmpty()
    _id!: mongoose.Schema.Types.ObjectId;

    @IsEmail()
    email!: string;
 
}
