import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { booksMock, IBook } from '@libs/common';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../src/environments/environments';
import { BooksStore } from '../store/book.store';
// import { GlobalService } from './global.service';

export const url = environment.gatewayApiUrl + '/books';

@Injectable({
  providedIn: 'root',
})

export class BooksService  {

  constructor(
    private http: HttpClient, 
    // private globalService: GlobalService,
   ) {
  }

  readonly booksStore = inject(BooksStore);

  searchBookOnGoogleApi(searchTerm: string){
    // return this.globalService.mockResponses.value ? 
    //   of(booksMock) :
    //   this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
    return  this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
  }

  getBooks() : Observable<IBook[]> {
    return this.http.get<IBook[]>(url).pipe(
      tap(books =>this.booksStore.setBooks(books)),
    );
  }

  createBook(book: Omit<IBook, '_id'>): Observable<IBook> {
    return this.http.post<IBook>(url, book).pipe(
      tap(book =>this.booksStore.addBook(book)),
    );
  }

  removeBook(id: string): Observable<IBook> {
    return this.http.delete<IBook>(`${url}/${id}`).pipe(
      tap(book =>this.booksStore.removeBook(book)),
    );
  }

  testBooks() {
    return this.http.get(`${url}/test-books`);
  }
}