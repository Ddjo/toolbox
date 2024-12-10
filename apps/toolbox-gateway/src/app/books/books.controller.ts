
// import { SignInDto } from './dto/sign-in.dto';

import { CurrentUser, JwtAuthGuard, UserDto } from "@libs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from '@nestjs/swagger';
import { BooksService } from "./books.service";
import { AddBookDto } from "./dto/add-book.dto";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}


  @Get()
  @UseGuards(JwtAuthGuard)
  getBooks() { 
    return this.booksService.getBooks();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createBookDto: AddBookDto, @CurrentUser() user: UserDto) {
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
  update(@Param('id') id: string, @Body() createBookDto: AddBookDto, @CurrentUser() user: UserDto) {
    return this.booksService.update(id, createBookDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
