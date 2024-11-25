import { CurrentUser, JwtAuthGuard, UserDTO } from '@libs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookService } from './book.service';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { UpdateBookInLibraryDto } from './dto/update-book-in-library.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}


  @MessagePattern('test-books')
  async testBooks() {
    console.log('test-books received');
    return [];
  }

  @MessagePattern('get-all-books')
  findAll() {
    console.log('books ms - getting all books')
    return this.bookService.findAll();
  }

  @MessagePattern('create-book')
  async create(@Payload() book: AddBookToLibraryDto, @CurrentUser() user: UserDTO) {
    console.log('create-book received', book);
    return this.bookService.create(book, user);
  }

  @MessagePattern('get-book')
  async findOne(@Payload() id: number) {
    console.log('get-book received', id);
    return this.bookService.findOne(id);
  }

  @MessagePattern('update-book')
  async update(@Payload() book : UpdateBookInLibraryDto) {
    console.log('update-book received', book);
    return this.bookService.update(book.id, book);  
  }

  @MessagePattern('remove-book')
  async remove(id: number) {
    console.log('remove-book received', id);
    return this.bookService.remove(id);  
  }

}