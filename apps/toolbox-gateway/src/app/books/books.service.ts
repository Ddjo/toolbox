import { BOOKS_SERVICE } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddBookDto } from './dto/add-book.dto';

@Injectable()
export class BooksService {
constructor( @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,     
) {}

  getBooks() {
    // console.log('gateway - getting all books')
    return this.booksClient.send('get-all-books', {})
  }

  create(createBookDto: AddBookDto,  user: UserDto) {
    // console.log('send create : ', {...createBookDto, createdByUser :  user})
    return this.booksClient.send('create-book', {...createBookDto, createdByUser :  user})
  }

  findOne(_id: string) {
    // console.log('send get-book from gateway')
    return this.booksClient.send('get-book', {_id})
  }

  update(_id: string, createBookDto: AddBookDto,  user: UserDto) {
    // console.log('send update-books from gateway', {...createBookDto, createdByUser :  user})
    return this.booksClient.send('update-book', {_id, ...createBookDto, updatedByUser :  user})
  }

  remove(_id: string) {
    // console.log('send remove-books from gateway', _id)
    return this.booksClient.send('remove-book', {_id})
  }

  testBooks() {
    return this.booksClient.send('test-books', {}); 
  }
}
