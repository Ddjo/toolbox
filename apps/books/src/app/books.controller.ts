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


  @MessagePattern('test-books')
  async testBooks() {
    // console.log('test-books received');
    return [];
  }

  @MessagePattern('get-all-books')
  findAll() {
    // console.log('books ms - getting all books')
    return this.booksService.findAll();
  }

  @MessagePattern('create-book')
  async create(@Payload() addBookDto: AddBookDto) {
    return this.booksService.create(addBookDto);
  }

  @MessagePattern('get-book')
  async findOne(@Payload() getBookDto: GetBookDto) {
    return this.booksService.findOne(getBookDto);
  }

  @MessagePattern('update-book')
  async update(@Payload() updateBookDto : UpdateBookDto) {
    // console.log('update-book received', updateBookDto);
    return this.booksService.update(updateBookDto._id, updateBookDto);  
  }

  @MessagePattern('remove-book')
  async remove(@Payload() removeBookDto: RemoveBookDto) {
    // console.log('remove-book received', removeBookDto);
    return this.booksService.remove(removeBookDto);  
  }

}