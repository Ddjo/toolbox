import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { catchError, map, Observable, of } from "rxjs";
import { BooksService } from "../../../../core/services/book.service";
import { BooksStore } from "../../../../core/store/books/books.store";

@Injectable({ providedIn: 'root' })
export class BookResolver implements Resolve<boolean> {

    constructor(
        private booksService: BooksService,
        private router: Router

    ) { }

    readonly booksStore = inject(BooksStore);

    resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<boolean> {
        const bookId = route.paramMap.get('id'); 

        if (bookId) {
            if (this.booksStore.booksIds().includes(bookId)) {
                return of(true);
            } else {
                return this.booksService.getBook(bookId).pipe(
                    map(() => true),
                    catchError((err) => {
                     console.log('book resolver - get book - err : ', err);
                     return of(false)}),
                 );
            }

        } else {
            this.router.navigate(['books']);
            return of(false);
        }
    }
}
