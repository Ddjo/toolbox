import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './books.repository';
import { RemoveBookDto } from './dto/remove-book.dto';
import { AddBookDto } from './dto/add-book.dto';
import { GetBookDto } from './dto/get-book.dto';


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

  async findOne(getBookDto: GetBookDto) {
    return this.bookRepository.findOne({_id: getBookDto._id });
  }

  async update(_id: string, updateBookDto: UpdateBookDto) {
    console.log('to update { _id: updateBookDto._id}', { _id: updateBookDto._id})
    return this.bookRepository.findOneAndUpdate({ _id: updateBookDto._id}, {$set: updateBookDto});
  }

  async remove(removeBookDto: RemoveBookDto) {
    return this.bookRepository.findOneAndDelete({ _id: removeBookDto._id});
  }
}
