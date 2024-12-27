import { IUser } from "../../user";
import { IChatMessage } from "../message";

export interface IChatRoom {
    _id: string;
	name : string;
	members : Pick<IUser, '_id' |'email'>[];
    messages : IChatMessage[];
    totalMessages: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum IChatRoomType {
    PERSONAL = 'personal',
    GROUP = 'group',
}
