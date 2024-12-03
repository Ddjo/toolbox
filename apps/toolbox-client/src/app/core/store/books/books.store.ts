import { IBook } from '@libs/common';
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

const booksConfig = entityConfig({
  entity: type<IBook>(),
  collection: 'books',
  selectId: (book) => book._id,
});

const booksState = signalState({
  loaded: false,
  error: ''
});

export const BooksStore = signalStore(
  { providedIn: 'root' },
  withEntities(booksConfig),
  withState(booksState),
  withMethods((store, ) => ({
    setBook(book: IBook) : void {
      patchState(store, setEntity({...book, publishedDate: new Date(book.publishedDate)}, booksConfig))
    },
    setBooks(books: IBook[]) : void {
      patchState(store, setAllEntities(books.map(book => {return {...book, publishedDate: new Date(book.publishedDate)}}), booksConfig))
      patchState(store, {error:'', loaded: true})
    },
    addBook(book: IBook): void {
      patchState(store, addEntity({...book, publishedDate: new Date(book.publishedDate)}, booksConfig));
    },
    updateBook(book: IBook): void {
      patchState(store, updateEntity({id: book._id, changes: {...book, publishedDate: new Date(book.publishedDate)}}, booksConfig));
    },
    removeBook(book: IBook): void {
      patchState(store, removeEntity(book._id, booksConfig));
    },
  }))
);

// export type BooksStore = InstanceType<typeof BooksStore>;

