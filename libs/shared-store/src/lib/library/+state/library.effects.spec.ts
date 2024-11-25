import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as BooksActions from './library.actions';
import { BooksEffects } from './library.effects';

describe('BooksEffects', () => {
  let actions: Observable<Action>;
  let effects: BooksEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        BooksEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(BooksEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: BooksActions.initBooks() });

      const expected = hot('-a-|', {
        a: BooksActions.loadBooksSuccess({ books: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
