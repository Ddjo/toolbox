import { CurrentUser, UserDTO } from '@libs/common';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { RemoveBookDto } from './dto/remove-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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
  async create(@Payload() addBookDto: AddBookDto, @CurrentUser() user: UserDTO) {
    console.log('create-book received', addBookDto);
    return this.booksService.create(addBookDto, user);
  }

  @MessagePattern('get-book')
  async findOne(@Payload() id: string) {
    console.log('get-book received', id);
    return this.booksService.findOne(id);
  }

  @MessagePattern('update-book')
  async update(@Payload() updateBookDto : UpdateBookDto) {
    console.log('update-book received', updateBookDto);
    return this.booksService.update(updateBookDto.id, updateBookDto);  
  }

  @MessagePattern('remove-book')
  async remove(@Payload() removeBookDto: RemoveBookDto) {
    console.log('remove-book received', removeBookDto);
    return this.booksService.remove(removeBookDto);  
  }

}