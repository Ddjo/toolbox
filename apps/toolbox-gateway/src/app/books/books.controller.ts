
// import { SignInDto } from './dto/sign-in.dto';

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { JwtAuthGuard } from "@libs/common";
import { AddBookToLibraryDto } from "../dto/books/add-book-to-library.dto";
import { UpdateBookInLibraryDto } from "../dto/books/update-book-in-library.dto";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('test-books')
  @UseGuards(JwtAuthGuard)
  testAuth() {
    console.log('send test-books from gateway')
    return this.booksService.testBooks();
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  getBooks() { 
    return this.booksService.getBooks();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookDto: AddBookToLibraryDto) {
    console.log('create book')
    return this.booksService.create(createBookDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookInLibraryDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }
}
