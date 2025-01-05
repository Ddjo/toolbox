import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { booksMock } from '@libs/common';
import { environment } from '../../../environments/environments';
import { BooksService } from './book.service';


describe('BooksService', () => {

  let booksService: BooksService;
  let httpTestingController: HttpTestingController;
  const url = environment.gatewayApiUrl + '/books';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    booksService = TestBed.inject(BooksService);
    
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(booksService).toBeTruthy();
  });

  it('should get books from google API', () => {
    booksService.searchBookOnGoogleApi('test').subscribe({
      next: (data) => {
        expect(data).toEqual('ok');
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`https://www.googleapis.com/books/v1/volumes?q=test`);
    expect(req.request.method).toBe('GET');
    req.flush('ok')

  });

  it('should get user books', () => {
    booksService.getBooks().subscribe({
      next: (data) => {
        expect(data).toEqual(booksMock);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush(booksMock) 

  });

  it('should get book', () => {
    booksService.getBook(booksMock[0]._id).subscribe({
      next: (data) => {
        expect(data).toEqual(booksMock[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/${booksMock[0]._id}`);
    expect(req.request.method).toBe('GET');
    req.flush(booksMock[0]) 
  });


  it('should create book', () => {
    booksService.createBook(booksMock[0]).subscribe({
      next: (data) => {
        expect(data).toEqual(booksMock[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(booksMock[0]) 
  });

  it('should update book', () => {
    booksService.updateBook(booksMock[0]).subscribe({
      next: (data) => {
        expect(data).toEqual(booksMock[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/${booksMock[0]._id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(booksMock[0]) 
  });

  it('should remove book', () => {
    booksService.removeBook(booksMock[0]._id).subscribe({
      next: (data) => {
        expect(data).toEqual(booksMock[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/${booksMock[0]._id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(booksMock[0]) 
  });

});
