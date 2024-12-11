import { IChatMessage } from '@libs/common';
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

const chatMessagesConfig = entityConfig({
  entity: type<IChatMessage>(),
  collection: 'chatMessages',
  selectId: (chatMessage) => chatMessage._id,
});

const chatMessagesState = signalState({
  loaded: false,
  isLoading: false,
  error: ''
});

export const ChatMessagesStore = signalStore(
  { providedIn: 'root' },
  withEntities(chatMessagesConfig),
  withState(chatMessagesState),
  withMethods((store, ) => ({
    setChatMessage(chatMessage: IChatMessage) : void {
      patchState(store, setEntity(chatMessage, chatMessagesConfig))
      patchState(store, {isLoading: false})
    },
    setChatMessages(chatMessages: IChatMessage[]) : void {
      patchState(store, setAllEntities(chatMessages, chatMessagesConfig))
      patchState(store, {loaded: true, isLoading: false})
    },
    addChatMessage(chatMessage: IChatMessage): void {
      patchState(store, addEntity(chatMessage, chatMessagesConfig));
      patchState(store, {isLoading: false})
    },
    updateChatMessage(chatMessage: IChatMessage): void {
      patchState(store, updateEntity({id: chatMessage._id, changes:chatMessage}, chatMessagesConfig));
      patchState(store, {isLoading: false})
    },
    removeChatMessage(chatMessage: IChatMessage): void {
      patchState(store, removeEntity(chatMessage._id, chatMessagesConfig));
      patchState(store, {isLoading: false})
    },
    setLoading(value: boolean): void {
      patchState(store, {isLoading: value})
    }
  }))
);

