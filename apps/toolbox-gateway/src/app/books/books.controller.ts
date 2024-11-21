
// import { SignInDto } from './dto/sign-in.dto';

import { Controller, Get, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { JwtAuthGuard } from "@libs/common";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getData() {
    return this.booksService.getData();
  }

  @Get('test-books')
  @UseGuards(JwtAuthGuard)
  testAuth() {
    console.log('send test-books from gateway')
    return this.booksService.testBooks();
  }
}
