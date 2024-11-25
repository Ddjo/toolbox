import { Injectable } from '@nestjs/common';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { UpdateBookInLibraryDto } from './dto/update-book-in-library.dto';
import { BookRepository } from './book.repository';


@Injectable()
export class BookService {

  constructor(private readonly bookRepository: BookRepository) {}

  async create(addBookToLibraryDto: AddBookToLibraryDto, userId) {
    return this.bookRepository.create({
      ...addBookToLibraryDto,
      userId 
    })
  }


  async findAll() {
    return this.bookRepository.find({});
  }

  async findOne(_id: number) {
    return this.bookRepository.findOne({_id });
  }

  async update(_id: number, updateBookInLibraryDto: UpdateBookInLibraryDto) {
    return this.bookRepository.findOneAndUpdate({ _id}, {$set: updateBookInLibraryDto});
  }

  async remove(_id: number) {
    return this.bookRepository.findOneAndDelete({ _id});
  }
}
