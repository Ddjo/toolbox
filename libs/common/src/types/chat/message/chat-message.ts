import { IUser } from "../../user";

export interface IChatMessage {
    _id: string;
    chatRoom: string;
    sender: Omit<IUser, 'password'>
    content: string;
}

