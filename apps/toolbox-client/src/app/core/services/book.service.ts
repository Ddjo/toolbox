import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { GlobalService } from './global.service';
import { environment } from 'apps/toolbox-client/src/environments/environments';
import { API_BOOK_TOKEN, booksMock } from '@site/shared-store';
import { IBook } from '@libs/common';

// export const url = environment.gatewayApiUrl + '/books';
@Injectable({
  providedIn: 'root',
})

export class BookService  {


  constructor(
    private http: HttpClient, 
    private globalService: GlobalService,
    @Inject(API_BOOK_TOKEN) private readonly apiUrl: string,
   ) {
  }

  searchBookOnGoogleApi(searchTerm: string){
    
    return this.globalService.mockResponses.value ? 
      of(booksMock) :
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
  }

  // getBooks() : Observable<IBook[]> {
  //   return this.http.get<IBook[]>(url);
  // }

  addBookToLibrary(book: IBook): Observable<IBook[]> {
    return this.http.post<IBook[]>(this.apiUrl, book);
  }

  // removeBookFromLibrary(id: string): Observable<IBook[]> {
  //   return this.http.delete<IBook[]>(`${url}/${id}`);
  // }

  testBooks() {
    return this.http.get(`${this.apiUrl}/test-books`);
  }
}