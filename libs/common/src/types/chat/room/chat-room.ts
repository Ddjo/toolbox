import { IUser } from "../../user";
import { IChatMessage } from "../message";

export interface IChatRoom {
    _id: string;
	name : string;
	members : Omit<IUser, 'password'>[];
    messages : IChatMessage[];
    totalMessages: number;
	// type: IChatRoomType;
}

export enum IChatRoomType {
    PERSONAL = 'personal',
    GROUP = 'group',
}
