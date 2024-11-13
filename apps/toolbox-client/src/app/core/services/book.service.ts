import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GlobalService } from './global.service';
import { Book } from '@site/app-books-types';
import { booksMock } from '@site/shared-store';

@Injectable({
  providedIn: 'root',
})

export class BookService  {
  host = 'http://localhost:3000/api';


  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  searchBookOnGoogleApi(searchTerm: string){
    
    return this.globalService.mockResponses.value ? 
      of(booksMock) :
      this.http.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
  }

  getBooks() : Observable<Book[]> {
    return this.http.get<Book[]>(`${this.host}/book`);
  }

  addBookToLibrary(book: Book): Observable<Book[]> {
    return this.http.post<Book[]>(`${this.host}/book`, book);
  }
  removeBookFromLibrary(id: string): Observable<Book[]> {
    return this.http.delete<Book[]>(`${this.host}/book/${id}`);
  }
}