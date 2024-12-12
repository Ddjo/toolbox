import { BOOKS_CREATE_BOOK, BOOKS_DELETE_BOOK, BOOKS_GET_ALL_BOOKS, BOOKS_GET_BOOK, BOOKS_SERVICE, BOOKS_UPDATE_BOOK } from '@constants';
import { UserDto } from '@libs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddBookDto } from './dto/add-book.dto';
import { TCPService } from '../helpers/tcp.service';

@Injectable()
export class BooksService {
constructor(
  @Inject(BOOKS_SERVICE) private readonly booksClient: ClientProxy,
  private readonly tcpService : TCPService
) {}

  getBooks() {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.booksClient, BOOKS_GET_ALL_BOOKS,  {});
  }

  create(createBookDto: AddBookDto,  user: UserDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.booksClient, BOOKS_CREATE_BOOK,  {...createBookDto, createdByUser :  user});
  }

  findOne(_id: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.booksClient, BOOKS_GET_BOOK,  {_id});
  }

  update(_id: string, createBookDto: AddBookDto,  user: UserDto) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.booksClient, BOOKS_UPDATE_BOOK,  {_id, ...createBookDto, updatedByUser :  user});
  }

  remove(_id: string) {
    return this.tcpService.sendTCPMessageFromHttpRequest(this.booksClient, BOOKS_DELETE_BOOK, {_id});
  }
}
