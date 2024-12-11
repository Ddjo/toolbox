import { IsEmail, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class SenderDto {
    @IsMongoId()
    @IsNotEmpty()
    _id!: mongoose.Schema.Types.ObjectId;

    @IsEmail()
    email!: string;
}
