
import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, filter, map, of } from "rxjs";
import { withLatestFrom } from 'rxjs/operators';
import { API_BOOK_TOKEN } from "../../api-token";
import { LibraryActions } from "./library.actions";
import { selectBooksLoaded } from "./library.selectors";
import { IBook } from "@libs/common";

@Injectable()
export class LibraryEffects {

  private actions$ = inject(Actions);
  private store = inject(Store);

  getAllBooksFromLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.getAllBooksFromLibrary),
      withLatestFrom(this.store.select(selectBooksLoaded), (action, isLoaded)  => (isLoaded)),
      filter((isLoaded) => !isLoaded),
      exhaustMap(() =>
        this.http.get<IBook[]>(`${this.apiUrl}`).pipe(
          map(books => LibraryActions.getAllBooksFromLibrarySuccess({ books })),
          catchError(error => of(LibraryActions.getAllBooksFromLibraryFailure({ error })))
        )
      ) 
    ),
  );

  addBookToLibrary$ = createEffect(() =>
    this.actions$.pipe( 
      ofType(LibraryActions.addBookToLibrary),
      exhaustMap(action =>
        this.http.post<Omit<IBook, 'id'>>(`${this.apiUrl}`, action.book).pipe(
          map(book =>  LibraryActions.addBookToLibrarySuccess({ book })),
          catchError(error => of(LibraryActions.addBookToLibraryFailure({ error })))
        )
      )
    )
  );

  removeBookFromLibrary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LibraryActions.removeBookFromLibrary),
      exhaustMap(action =>
        this.http.delete<string>(`${this.apiUrl}/${action.id}`).pipe(
          map(() =>   LibraryActions.removeBookFromLibrarySuccess({ id: action.id })),
          catchError(error =>  of(LibraryActions.removeBookFromLibraryFailure({ error })))
        )
      )
    )
  );

  constructor(
    @Inject(API_BOOK_TOKEN) private readonly apiUrl: string,
    // private store: Store<LibraryState>,
    // private libraryFacade: LibraryFacade,
    private readonly http: HttpClient) { }

}
