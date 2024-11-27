import { inject, Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { BooksService } from "../../../../core/services/book.service";
import { BooksStore } from "../../../../core/store/books/books.store";

@Injectable({ providedIn: 'root' })
export class LibraryResolver implements Resolve<boolean> {

    constructor(
        private booksService: BooksService,
    ) { }

    readonly booksStore = inject(BooksStore);

    resolve(): Observable<boolean> {
        if (!this.booksStore.loaded()) {
           return this.booksService.getBooks().pipe(
               map(() => true),
               catchError((err) => {
                console.log('library resolver - get books - err : ', err);
                return of(false)}),
            );
        } else {
            return of(true);
        }
    }
}
