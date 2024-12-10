import { IUser } from "../../user";

export interface IChatRoom {
    _id: string;
	name : string;
	members : Omit<IUser, 'password'>[];
	type: IChatRoomType;
}

export enum IChatRoomType {
    PERSONAL = 'personal',
    GROUP = 'group',
}
