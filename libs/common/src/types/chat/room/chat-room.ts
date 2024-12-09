
export interface IChatRoom {
    _id: string;
	name : string;
	members : string[];
	type: ChatRoomType;
}

export enum ChatRoomType {
    PERSONAL = 'personal',
    GROUP = 'group',
}
