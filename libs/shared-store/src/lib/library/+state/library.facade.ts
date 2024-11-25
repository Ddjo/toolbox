import { inject, Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LibraryActions } from './library.actions';
import { selectAllBooksInLibrary, selectBooksLoaded } from './library.selectors';
import { IBook } from '@libs/common';


@Injectable()
export class LibraryFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(selectBooksLoaded));
  allBooksInLibrary$ = this.store.pipe(select(selectAllBooksInLibrary));
  // selectedBooks$ = this.store.pipe(select(BooksSelectors.selectEntity));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  getBooksFromLibrary() {
    this.store.dispatch(LibraryActions.getAllBooksFromLibrary());
  }

  addBookToLibrary(book: Omit<IBook, 'id'>) {
    this.store.dispatch(LibraryActions.addBookToLibrary({book}));
  }

  removeBookFromLibrary(id : string) {
    this.store.dispatch(LibraryActions.removeBookFromLibrary({id}));
  }
}
