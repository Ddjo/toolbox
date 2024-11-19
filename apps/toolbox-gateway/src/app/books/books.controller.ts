
// import { SignInDto } from './dto/sign-in.dto';

import { Controller, Get } from "@nestjs/common";
import { BooksService } from "./books.service";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getData() {
    return this.booksService.getData();
  }

  @Get('test-books')
  testAuth() {
    console.log('send test-books from gateway')
    return this.booksService.testBooks();
  }
}
