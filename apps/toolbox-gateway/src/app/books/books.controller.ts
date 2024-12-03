
// import { SignInDto } from './dto/sign-in.dto';

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CurrentUser, IUser, JwtAuthGuard } from "@libs/common";
import { AddBookDto } from "../dto/books/add-book.dto";
import { ApiBearerAuth } from '@nestjs/swagger';

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
  @ApiBearerAuth()
  create(@Body() createBookDto: AddBookDto, @CurrentUser() user: IUser) {
    return this.booksService.create(createBookDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() createBookDto: AddBookDto, @CurrentUser() user: IUser) {
    return this.booksService.update(id, createBookDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
