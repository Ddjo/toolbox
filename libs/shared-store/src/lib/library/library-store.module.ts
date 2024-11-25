import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { LibraryEffects } from './+state/library.effects';
import { LIBRARY_FEATURE_KEY, libraryReducer } from './+state/library.reducer';
import { LibraryFacade } from './+state/library.facade';

@NgModule({
  providers: [
    provideState(LIBRARY_FEATURE_KEY, libraryReducer),
    provideEffects([LibraryEffects]),
    LibraryFacade
  ],
  
})
export class LibraryStoreModule {}
