import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './books.repository';
import { RemoveBookDto } from './dto/remove-book.dto';
import { AddBookDto } from './dto/add-book.dto';


@Injectable()
export class BooksService {

  constructor(private readonly bookRepository: BookRepository) {}

  async create(addBookDto: AddBookDto, userId) {
    return this.bookRepository.create({
      ...addBookDto,
      userId 
    })
  }


  async findAll() {
    return this.bookRepository.find({});
  }

  async findOne(_id: string) {
    return this.bookRepository.findOne({_id });
  }

  async update(_id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.findOneAndUpdate({ _id}, {$set: updateBookDto});
  }

  async remove(removeBookDto: RemoveBookDto) {
    return this.bookRepository.findOneAndDelete({ _id: removeBookDto.id});
  }
}
