import { inject, Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { BooksService } from "../services/book.service";
import { BooksStore } from "../store/book.store";

@Injectable({ providedIn: 'root' })
export class BooksResolver implements Resolve<boolean> {

    constructor(
        private booksService: BooksService,
        // private booksStore: BooksStore
    ) { }

    readonly booksStore = inject(BooksStore);

    resolve(): Observable<boolean> {
        if (!this.booksStore.loaded()) {
           return this.booksService.getBooks().pipe(
               map(() => true),
               catchError((err) => {
                console.log('book resolver - get books - err : ', err);
                return of(false)}),
            );
        } else {
            return of(true);
        }
    }
}
