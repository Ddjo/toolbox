import { BOOKS_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateBookDto } from '../dto/books/update-book.dto';
import { AddBookDto } from '../dto/books/add-book.dto';

@Injectable()
export class BooksService {
constructor( @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,     
) {}

  getBooks() {
    console.log('gateway - getting all books')
    return this.booksClient.send('get-all-books', {})
  }

  create(createBookDto: AddBookDto) {
    console.log('send create-books from gateway', createBookDto)
    return this.booksClient.send('create-book', createBookDto)
  }

  findOne(id: string) {
    console.log('send get-book from gateway')
    return this.booksClient.send('get-book', {id})
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    console.log('send update-books from gateway')
    return this.booksClient.send('update-book', {id: id, book: updateBookDto})
  }

  remove(id: string) {
    console.log('send remove-books from gateway', id)
    return this.booksClient.send('remove-book', {id})
  }

  testBooks() {
    return this.booksClient.send('test-books', {}); 
  }
}
