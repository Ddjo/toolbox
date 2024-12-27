import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ObjectId } from "mongoose";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class CreateChatMessageDto {

    _id: ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    readonly chatRoomId: ObjectId;
    
    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly sender: UserWithoutPasswordDto
}
