import { BOOKS_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddBookToLibraryDto } from '../dto/books/add-book-to-library.dto';
import { UpdateBookInLibraryDto } from '../dto/books/update-book-in-library.dto';

@Injectable()
export class BooksService {
constructor( @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,     
) {}

  getBooks() {
    console.log('gateway - getting all books')
    return this.booksClient.send('get-all-books', {})
  }

  create(createBookDto: AddBookToLibraryDto) {
    console.log('send create-books from gateway', createBookDto)
    return this.booksClient.send('create-book', createBookDto)
  }

  findOne(id: number) {
    console.log('send get-book from gateway')
    return this.booksClient.send('get-book', {id})
  }

  update(id: number, updateBookDto: UpdateBookInLibraryDto) {
    console.log('send update-books from gateway')
    return this.booksClient.send('update-book', {id: id, book: updateBookDto})
  }

  remove(id: number) {
    console.log('send remove-books from gateway')
    return this.booksClient.send('remove-book', {id})
  }

  testBooks() {
    return this.booksClient.send('test-books', {}); 
  }
}
