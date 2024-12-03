import { BOOKS_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddBookDto } from '../dto/books/add-book.dto';
import { IUser } from '@libs/common';

@Injectable()
export class BooksService {
constructor( @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,     
) {}

  getBooks() {
    console.log('gateway - getting all books')
    return this.booksClient.send('get-all-books', {})
  }

  create(createBookDto: AddBookDto,  user: IUser) {
    return this.booksClient.send('create-book', {...createBookDto, createdByUserId :  user._id})
  }

  findOne(_id: string) {
    console.log('send get-book from gateway')
    return this.booksClient.send('get-book', {_id})
  }

  update(_id: string, createBookDto: AddBookDto,  user: IUser) {
    console.log('send update-books from gateway')
    return this.booksClient.send('update-book', {_id, ...createBookDto, updatedByUserId :  user._id})
  }

  remove(_id: string) {
    console.log('send remove-books from gateway', _id)
    return this.booksClient.send('remove-book', {_id})
  }

  testBooks() {
    return this.booksClient.send('test-books', {}); 
  }
}
