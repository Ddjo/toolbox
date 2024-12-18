import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { ObjectId } from 'mongoose';

export class GetMessagesForChatRoomDto {

    @IsNotEmpty()
    @IsMongoId()
    readonly chatRoomId: ObjectId;

    @IsNumber()
    readonly skip: number;

    @IsNumber()
    readonly messagesLimit: number;

}
