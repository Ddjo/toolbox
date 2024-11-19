import { BOOKS_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BooksService {
constructor( @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,     
) {}

  getData(): { message: string } {
    return { message: 'books get API' };
  }

  testBooks() {
    return this.booksClient.send('test-books', {}); 
  }
}
