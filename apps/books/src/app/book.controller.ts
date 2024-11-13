import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { UpdateBookInLibraryDto } from './dto/update-book-in-library.dto';
import { CurrentUser, JwtAuthGuard, UserDTO } from '@libs/common';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() addBookToLibraryDto: AddBookToLibraryDto,
    @CurrentUser() user: UserDTO
  ) {
    return this.bookService.addBookToLibrary(addBookToLibraryDto, user._id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBookInLibraryDto: UpdateBookInLibraryDto) {
    return this.bookService.update(+id, updateBookInLibraryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
