import { IChatRoom } from '@libs/common';
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

const chatRoomsConfig = entityConfig({
  entity: type<IChatRoom>(),
  collection: 'chatRooms',
  selectId: (chatRoom) => chatRoom._id,
});

const chatRoomsState = signalState({
  loaded: false,
  error: ''
});

export const ChatRoomsStore = signalStore(
  { providedIn: 'root' },
  withEntities(chatRoomsConfig),
  withState(chatRoomsState),
  withMethods((store, ) => ({
    setChatRoom(chatRoom: IChatRoom) : void {
      patchState(store, setEntity(chatRoom, chatRoomsConfig))
    },
    setChatRooms(chatRooms: IChatRoom[]) : void {
      patchState(store, setAllEntities(chatRooms, chatRoomsConfig))
      patchState(store, {error:'', loaded: true})
    },
    addChatRoom(chatRoom: IChatRoom): void {
      patchState(store, addEntity(chatRoom, chatRoomsConfig));
    },
    updateChatRoom(chatRoom: IChatRoom): void {
        patchState(store, updateEntity({id: chatRoom._id, changes:chatRoom}, chatRoomsConfig));
    },
    removeChatRoom(chatRoom: IChatRoom): void {
      patchState(store, removeEntity(chatRoom._id, chatRoomsConfig));
    },
  }))
);

