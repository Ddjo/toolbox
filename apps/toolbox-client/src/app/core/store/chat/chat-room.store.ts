import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { IChatMessage, IChatRoom } from '@libs/common';
import {
  patchState,
  signalState,
  signalStore,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  setAllEntities,
  setEntity,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';

export interface ITypingUser {
  userMail: string;
  startTypingAtTimeStamp: number;
}

export interface IChatRoomEntity extends IChatRoom {
  typingUsers: ITypingUser[];
}

// Entity Configuration
const chatRoomsConfig = entityConfig({
  entity: type<IChatRoomEntity>(),
  collection: 'chatRooms',
  selectId: (chatRoom) => chatRoom._id,
});

const chatRoomsState = signalState({
  loaded: false,
  isLoading: false,
  error: '',
});

function sortMessages(messages: IChatMessage[]): IChatMessage[] {
  return messages.sort(
    (msg1, msg2) =>
      new Date(msg1.createdAt).getTime() - new Date(msg2.createdAt).getTime()
  );
}

function updateTypingUsers(
  currentTypingUsers: ITypingUser[],
  typingUserMail: string
): ITypingUser[] {
  return [
    ...currentTypingUsers.filter((user) => user.userMail !== typingUserMail),
    { userMail: typingUserMail, startTypingAtTimeStamp: Date.now() },
  ];
}

export const ChatRoomsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('chatRooms'),
  withEntities(chatRoomsConfig),
  withState(chatRoomsState),
  withMethods((store) => ({
    // Set a single chat room
    setChatRoom(chatRoom: IChatRoom): void {
      patchState(
        store,
        setEntity(
          {
            ...chatRoom,
            typingUsers: [] as ITypingUser[],
            messages: sortMessages(chatRoom.messages),
          },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    // Set multiple chat rooms
    setChatRooms(chatRooms: IChatRoom[]): void {
      const entities = chatRooms.map((chatRoom) => ({
        ...chatRoom,
        typingUsers: [] as ITypingUser[],
        messages: sortMessages(chatRoom.messages),
      }));

      patchState(store, setAllEntities(entities, chatRoomsConfig));
      patchState(store, { loaded: true, isLoading: false });
    },

    // Add a new chat room
    addChatRoom(chatRoom: IChatRoom): void {
      patchState(
        store,
        addEntity(
          { ...chatRoom, typingUsers: [] as ITypingUser[] },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    // Update a chat room
    updateChatRoom(chatRoom: IChatRoom): void {
      patchState(
        store,
        updateEntity(
          { id: chatRoom._id, changes: chatRoom },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    // Remove a chat room
    removeChatRoom(chatRoomId: string): void {
      patchState(store, removeEntity(chatRoomId, chatRoomsConfig));
      patchState(store, { isLoading: false });
    },

    // Add a message to a chat room
    addMessageToChatRoom(chatRoomId: string, message: IChatMessage): void {
      const chatRoom = store.chatRoomsEntities().find(
        (room) => room._id === chatRoomId
      ) as IChatRoomEntity;

      patchState(
        store,
        updateEntity(
          {
            id: chatRoomId,
            changes: {
              messages: [...chatRoom.messages, message],
            },
          },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    // Add multiple messages to a chat room
    addMessagesToChatRoom(chatRoomId: string, messages: IChatMessage[]): void {
      const chatRoom = store.chatRoomsEntities().find(
        (room) => room._id === chatRoomId
      ) as IChatRoomEntity;

      const newMessagesArray = sortMessages([...chatRoom.messages, ...messages]);

      patchState(
        store,
        updateEntity(
          {
            id: chatRoomId,
            changes: {
              messages: newMessagesArray,
            },
          },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    // Update a specific chat message in a chat room
    updateChatMessageInChatRoom(chatRoomId: string, chatMessage: IChatMessage): void {
      const chatRoom = store.chatRoomsEntities().find(
        (room) => room._id === chatRoomId
      ) as IChatRoomEntity;

      patchState(
        store,
        updateEntity(
          {
            id: chatRoomId,
            changes: {
              messages: [
                ...chatRoom.messages.filter(
                  (msg) => msg._id !== chatMessage._id
                ),
                chatMessage,
              ].sort(
                (msg1, msg2) =>
                  new Date(msg1.createdAt).getTime() -
                  new Date(msg2.createdAt).getTime()
              ),
            },
          },
          chatRoomsConfig
        )
      );
      patchState(store, { isLoading: false });
    },

    addTypingUser(chatRoomId: string, typingUserMail: string): void {
      const chatRoom = store.chatRoomsEntities().find(
        (room) => room._id === chatRoomId
      ) as IChatRoomEntity;
    
      // Modify typingUsers only
      patchState(
        store,
        updateEntity(
          {
            id: chatRoomId,
            changes: {
              typingUsers: updateTypingUsers(
                chatRoom.typingUsers,
                typingUserMail
              ),
            },
          },
          chatRoomsConfig
        )
      );
    
      patchState(store, { isLoading: false });
    },

      // You can also implement a method for removing a typing user
    removeTypingUser(chatRoomId: string, typingUserMail: string): void {
      const chatRoom = store.chatRoomsEntities().find(
        (room) => room._id === chatRoomId
      ) as IChatRoomEntity;

      patchState(
        store,
        updateEntity(
          {
            id: chatRoomId,
            changes: {
              typingUsers: chatRoom.typingUsers.filter(
                (user) => user.userMail !== typingUserMail
              ),
            },
          },
          chatRoomsConfig
        )
      );

      patchState(store, { isLoading: false });
    },
    
  }))

  
  
);
