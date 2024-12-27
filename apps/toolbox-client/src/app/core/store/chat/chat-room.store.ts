import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { IChatMessage, IChatRoom } from '@libs/common';
import { patchState, signalState, signalStore, type, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  setAllEntities,
  setEntity,
  updateEntity,
  withEntities
} from '@ngrx/signals/entities';

export interface IChatRoomEntity extends IChatRoom {
  typingUsers : {userMail: string, startTypingAtTimeStamp: number}[]
}

const chatRoomsConfig = entityConfig({
  entity: type<IChatRoomEntity>(),
  collection: 'chatRooms',
  selectId: (chatRoom) => chatRoom._id,
});

const chatRoomsState = signalState({
  loaded: false,
  isLoading: false,
  error: ''
});

export const ChatRoomsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('chatRooms'),
  withEntities(chatRoomsConfig),
  withState(chatRoomsState),
  withMethods((store, ) => ({
    setChatRoom(chatRoom: IChatRoom) : void {
      patchState(store, setEntity({
        ...chatRoom,
        typingUsers: [] as any,
        messages: [...chatRoom.messages
          .sort((message1, message2) => new Date(message1.createdAt).getTime() -  new Date(message2.createdAt).getTime())],
      }, chatRoomsConfig))
      patchState(store, {isLoading: false})
    },
    setChatRooms(chatRooms: IChatRoom[]) : void {
      patchState(store, setAllEntities(chatRooms.map(chatRoom => { return {
        ...chatRoom,
        typingUsers: [] as any,
        messages: [...chatRoom.messages
          .sort((message1, message2) => new Date(message1.createdAt).getTime() -  new Date(message2.createdAt).getTime())]
      } }), chatRoomsConfig))
      patchState(store, {loaded: true, isLoading: false})
    },
    addChatRoom(chatRoom: IChatRoom): void {
      patchState(store, addEntity({...chatRoom,typingUsers: [] as any,}, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    updateChatRoom(chatRoom: IChatRoom): void {
      patchState(store, updateEntity({id: chatRoom._id, changes:chatRoom}, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    removeChatRoom(chatRoom: IChatRoom): void {
      patchState(store, removeEntity(chatRoom._id, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    addMessageToChatRoom(chatRoomId: string, message: IChatMessage): void {
      patchState(store, updateEntity({id: chatRoomId, 
        changes:{
          messages : 
            [...(store.chatRoomsEntities().find(chatRoom => chatRoom._id === chatRoomId) as IChatRoomEntity).messages, message ]
            .sort((message1, message2) => new Date(message1.createdAt).getTime() -  new Date(message2.createdAt).getTime())
        }
      }, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    addMessagesToChatRoom(chatRoom: IChatRoom, messages: IChatMessage[]): void {
      patchState(store, updateEntity({id: chatRoom._id, 
        changes:{
          messages : 
            [...chatRoom.messages, ...messages ]
            .sort((message1, message2) => new Date(message1.createdAt).getTime() -  new Date(message2.createdAt).getTime())

        }
      }, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    updateChatMessageInChatRoom(chatRoom: IChatRoom, chatMessage: IChatMessage) {
      patchState(
        store,
        updateEntity(
          {
            id: chatMessage.chatRoomId,
            changes: {
              messages: [
                // Filter out the old message
                ...chatRoom.messages
                  .filter(existingMessage => existingMessage._id !== chatMessage._id),
                // Add the updated message
                chatMessage,
              ].sort(
                (message1, message2) =>
                  new Date(message1.createdAt).getTime() -
                  new Date(message2.createdAt).getTime()
              ),
            },
          },
          chatRoomsConfig
        )
      );
    
      patchState(store, { isLoading: false });
    },
    addTypingUser(chatRoom: IChatRoom, typingUserMail: string): void {
      patchState(store, updateEntity(
        {
          id: chatRoom._id, 
          changes:{
            typingUsers: [...(store.chatRoomsEntities()
              .find(chatRoom => chatRoom._id === chatRoom._id) as IChatRoomEntity).typingUsers
              .filter(typingUser => typingUser.userMail !== typingUserMail) ,
              {userMail: typingUserMail, startTypingAtTimeStamp: Date.now()} ]
          }
        }, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },
    removeTypingUser(chatRoomId: string, typingUserMail: string): void {
      patchState(store, updateEntity(
        {
          id: chatRoomId, 
          changes:{
            typingUsers: [...(store.chatRoomsEntities()
              .find(chatRoom => chatRoom._id === chatRoomId) as IChatRoomEntity).typingUsers
              .filter(typingUser => typingUser.userMail !== typingUserMail) ]
          }
        }, chatRoomsConfig));
      patchState(store, {isLoading: false})
    },    setLoading(value: boolean): void {
      patchState(store, {isLoading: value})
    }
  }))
);

