import { BOOKS_CREATE_BOOK, BOOKS_DELETE_BOOK, BOOKS_GET_ALL_BOOKS, BOOKS_GET_BOOK, BOOKS_SERVICE, BOOKS_UPDATE_BOOK } from '@constants';
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
    return this.booksClient.send(BOOKS_GET_ALL_BOOKS, {})
  }

  create(createBookDto: AddBookDto,  user: UserDto) {
    // console.log('send create : ', {...createBookDto, createdByUser :  user})
    return this.booksClient.send(BOOKS_CREATE_BOOK, {...createBookDto, createdByUser :  user})
  }

  findOne(_id: string) {
    // console.log('send get-book from gateway')
    return this.booksClient.send(BOOKS_GET_BOOK, {_id})
  }

  update(_id: string, createBookDto: AddBookDto,  user: UserDto) {
    // console.log('send update-books from gateway', {...createBookDto, createdByUser :  user})
    return this.booksClient.send(BOOKS_UPDATE_BOOK, {_id, ...createBookDto, updatedByUser :  user})
  }

  remove(_id: string) {
    // console.log('send remove-books from gateway', _id)
    return this.booksClient.send(BOOKS_DELETE_BOOK, {_id})
  }
}
