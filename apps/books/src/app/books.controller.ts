import { CurrentUser, UserDTO } from '@libs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { UpdateBookInLibraryDto } from './dto/update-book-in-library.dto';

@Controller('books')
export class BookController {
  constructor(private readonly booksService: BooksService) {}


  @MessagePattern('test-books')
  async testBooks() {
    console.log('test-books received');
    return [];
  }

  @MessagePattern('get-all-books')
  findAll() {
    console.log('books ms - getting all books')
    return this.booksService.findAll();
  }

  @MessagePattern('create-book')
  async create(@Payload() book: AddBookToLibraryDto, @CurrentUser() user: UserDTO) {
    console.log('create-book received', book);
    return this.booksService.create(book, user);
  }

  @MessagePattern('get-book')
  async findOne(@Payload() id: number) {
    console.log('get-book received', id);
    return this.booksService.findOne(id);
  }

  @MessagePattern('update-book')
  async update(@Payload() book : UpdateBookInLibraryDto) {
    console.log('update-book received', book);
    return this.booksService.update(book.id, book);  
  }

  @MessagePattern('remove-book')
  async remove(id: number) {
    console.log('remove-book received', id);
    return this.booksService.remove(id);  
  }

}