import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class GetMessagesForChatRoomDto {
    @IsMongoId()
    @IsNotEmpty()
    chatRoomId: mongoose.Schema.Types.ObjectId;
}
