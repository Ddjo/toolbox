import { BOOKS_CREATE_BOOK, BOOKS_DELETE_BOOK, BOOKS_GET_ALL_BOOKS, BOOKS_GET_BOOK, BOOKS_UPDATE_BOOK } from '@constants';
import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { RemoveBookDto } from './dto/remove-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UsePipes(new ValidationPipe())
@Controller()
export class BookController {
  constructor(private readonly booksService: BooksService) {}

  @MessagePattern(BOOKS_GET_ALL_BOOKS)
  findAll() {
    // console.log('books ms - getting all books')
    return this.booksService.findAll();
  }

  @MessagePattern(BOOKS_CREATE_BOOK)
  async create(@Payload() addBookDto: AddBookDto) {
    return this.booksService.create(addBookDto);
  }

  @MessagePattern(BOOKS_GET_BOOK)
  async findOne(@Payload() getBookDto: GetBookDto) {
    return this.booksService.findOne(getBookDto);
  }

  @MessagePattern(BOOKS_UPDATE_BOOK)
  async update(@Payload() updateBookDto : UpdateBookDto) {
    // console.log('update-book received', updateBookDto);
    return this.booksService.update(updateBookDto._id, updateBookDto);  
  }

  @MessagePattern(BOOKS_DELETE_BOOK)
  async delete(@Payload() removeBookDto: RemoveBookDto) {
    // console.log('remove-book received', removeBookDto);
    return this.booksService.remove(removeBookDto);  
  }

}