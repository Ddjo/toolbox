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
  isLoading: false,
  error: ''
});

export const ChatRoomsStore = signalStore(
  { providedIn: 'root' },
  withEntities(chatRoomsConfig),
  withState(chatRoomsState),
  withMethods((store, ) => ({
    setChatRoom(chatRoom: IChatRoom) : void {
      patchState(store, setEntity(chatRoom, chatRoomsConfig))
      patchState(store, {isLoading: false})
    },
    setChatRooms(chatRooms: IChatRoom[]) : void {
      patchState(store, setAllEntities(chatRooms, chatRoomsConfig))
      patchState(store, {loaded: true, isLoading: false})
    },
    addChatRoom(chatRoom: IChatRoom): void {
      patchState(store, addEntity(chatRoom, chatRoomsConfig));
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
    setLoading(value: boolean): void {
      patchState(store, {isLoading: value})
    }
  }))
);

