import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GlobalService } from './global.service';
import { environment } from 'apps/toolbox-client/src/environments/environments';

export const url = environment.gatewayApiUrl + '/books';
@Injectable({
  providedIn: 'root',
})

export class BookService  {


  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  searchBookOnGoogleApi(searchTerm: string){
    
    // return 
    // this.globalService.mockResponses.value ? 
    //   of(booksMock) :
    //   this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
  }

  // getBooks() : Observable<Book[]> {
  //   return this.http.get<Book[]>(url);
  // }

  // addBookToLibrary(book: Book): Observable<Book[]> {
  //   return this.http.post<Book[]>(url, book);
  // }
  // removeBookFromLibrary(id: string): Observable<Book[]> {
  //   return this.http.delete<Book[]>(`${url}/${id}`);
  // }

  testBooks() {
    return this.http.get(`${url}/test-books`);
  }
}