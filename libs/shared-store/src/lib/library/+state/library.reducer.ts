
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { LibraryActions } from './library.actions';
import { IBook } from '@libs/common';

export const LIBRARY_FEATURE_KEY = 'library';

export interface LibraryState extends EntityState<IBook> {
  selectedId?: string | number; // which Books record has been selected
  loaded: boolean; // has the Books list been loaded
  error?: string | null; // last known error (if any)
}


export const libraryAdapter: EntityAdapter<IBook> =
  createEntityAdapter<IBook>();

export const initialLibraryState: LibraryState = libraryAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

export const libraryReducer = createReducer(
  initialLibraryState,
  on(LibraryActions.getAllBooksFromLibrary, (state) => ({ ...state, isLoading: true })),
  on(LibraryActions.getAllBooksFromLibrarySuccess, (state, action) => (
    libraryAdapter.setAll(action.books, {
      ...state,
      loaded: true,
    })
  )),
  on(LibraryActions.getAllBooksFromLibraryFailure, (state, action) =>{
    console.error(action.error);

    return ({
    ...state,

    error: action.error,
  })}),
  on(LibraryActions.addBookToLibrary, (state) => ({ ...state, isLoading: true })),
  on(LibraryActions.addBookToLibrarySuccess, (state, { book }) =>    
    libraryAdapter.upsertOne(book as IBook, state)
  ),
  on(LibraryActions.addBookToLibraryFailure, (state, action) => {
    console.error(action.error);
    return ({
    ...state,
    error: action.error,
  })}),
  on(LibraryActions.removeBookFromLibrary, (state) => ({ ...state, isLoading: true })),
  on(LibraryActions.removeBookFromLibrarySuccess, (state, { id }) =>    
    libraryAdapter.removeOne(id, state)
  ),
  on(LibraryActions.addBookToLibraryFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
);
