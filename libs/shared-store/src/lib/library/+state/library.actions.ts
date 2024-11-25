

import { IBook } from '@libs/common';
import { createActionGroup, emptyProps, props } from '@ngrx/store';


export const LibraryActions = createActionGroup({
  source: 'Library',
  events: {
    'Get All Books From Library':  emptyProps(), 
    'Get All Books From Library Success': props<{ books: IBook[] }>(),
    'Get All Books From Library Failure': props<{ error: string }>(),
    'Add Book To Library': props<{ book: Omit<IBook, 'id'> }>(),
    'Add Book To Library Success': props<{ book  : Omit<IBook, 'id'> }>(),
    'Add Book To Library Failure': props<{  error: string  }>(),
    'Remove Book From Library': props<{ id:string }>(),
    'Remove Book From Library Success': props<{ id : string}>(),
    'Remove Book From Library Failure': props<{  error: string  }>(),
  },
});

