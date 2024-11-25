import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LIBRARY_FEATURE_KEY, libraryAdapter, LibraryState } from './library.reducer';

// Lookup the 'Books' feature state managed by NgRx
export const selectLibraryState =
  createFeatureSelector<LibraryState>(LIBRARY_FEATURE_KEY);

const { selectAll, selectEntities } = libraryAdapter.getSelectors();

export const selectBooksLoaded = createSelector(
  selectLibraryState,
  (state: LibraryState) => state.loaded
);

// export const selectBooksError = createSelector(
//   selectLibraryState,
//   (state: LibraryState) => state.error
// );

export const selectAllBooksInLibrary = createSelector(
  selectLibraryState,
  (state: LibraryState) => selectAll(state)
);

export const selectBooksEntities = createSelector(
  selectLibraryState,
  (state: LibraryState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectLibraryState,
  (state: LibraryState) => state.selectedId
);

export const selectEntity = createSelector(
  selectBooksEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);

// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import {  BOOKS_FEATURE_KEY, LibraryState } from './books.reducer';

// export const getLibraryState =
//   createFeatureSelector<LibraryState>(BOOKS_FEATURE_KEY);


// export const getBooksLoading = createSelector(
//   getLibraryState,
//   (state) => state.isLoading
// );
