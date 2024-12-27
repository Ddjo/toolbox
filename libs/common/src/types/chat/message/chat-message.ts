import { IUser } from "../../user";
import { IChatRoom } from "../room";

export interface IChatMessage {
    _id: string;
    chatRoomId: string;
    sender: Pick<IUser, '_id' |'email'>
    views : IChatMessageView[];
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IChatMessageView {
    user: Pick<IUser, '_id' |'email'>;
    viewedAt: Date;
}
