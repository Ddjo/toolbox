import { ChatRoomUpdateType } from "@constants";

  export interface ChatRoomUpdateEvent {
    chatRoomId: string;
    updateType: ChatRoomUpdateType;
    payload: any; // The actual data depends on the update type
  }
  
  export interface ChatroomCreatedEvent {
    chatRoomId: string;
    name: string;
    members: string[];
    createdAt: string;
  }
  
  export interface UserTypingEvent {
    userEmail: string;
  }

  export interface UserUntypingEvent {
    userEmail: string;
  }

  