import { IUser } from '@libs/common';
import { patchState, signalState, signalStore, type, withMethods, withState } from '@ngrx/signals';
import {
  addEntity,
  entityConfig,
  removeEntity,
  setAllEntities,
  setEntity,
  withEntities
} from '@ngrx/signals/entities';

const usersConfig = entityConfig({
  entity: type<IUser>(),
  collection: 'users',
  selectId: (user) => user._id,
});

const usersState = signalState({
  loaded: false,
  error: ''
});

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withEntities(usersConfig),
  withState(usersState),
  withMethods((store, ) => ({
    setUser(user: IUser) : void {
      patchState(store, setEntity(user, usersConfig))
    },
    setUsers(users: IUser[]) : void {
      patchState(store, setAllEntities(users, usersConfig))
      patchState(store, {error:'', loaded: true})
    },
    addUser(user: IUser): void {
      patchState(store, addEntity(user, usersConfig));
    },
    // updateUser(user: IUser): void {
    //   patchState(store, updateEntity({id: user._id, changes: user, usersConfig}));
    // },
    removeUser(user: IUser): void {
      patchState(store, removeEntity(user._id, usersConfig));
    },
  }))
);

