import { Injectable } from '@nestjs/common';
import { BookRepository } from './books.repository';
import { AddBookDto } from './dto/add-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { RemoveBookDto } from './dto/remove-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';


@Injectable()
export class BooksService {

  constructor(private readonly bookRepository: BookRepository) {}

  async create(addBookDto: AddBookDto) {
    const createdBook = await this.bookRepository.create({
      ...addBookDto,
      creationDate: new Date(),
      updatedByUser: addBookDto.createdByUser,
      updateDate: new Date()
    });

    return {
      _id: createdBook._id,
      title: createdBook.title,
      authors: createdBook.authors,
      publishedDate: createdBook.publishedDate
    };
  }


  async findAll() {
    return this.bookRepository.find({}, { _id: 1, title: 1, authors: 1, publishedDate: 1 });
  }

  async findOne(getBookDto: GetBookDto) {
    return this.bookRepository.findOne({_id: getBookDto._id }, { _id: 1, title: 1, authors: 1, publishedDate: 1 });
  }

  async update(_id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.findOneAndUpdate({ _id: updateBookDto._id}, 
      {$set: {...updateBookDto,
        updateDate: new Date(),
        updatedByUser: updateBookDto.updatedByUser,
      }}, 
      { _id: 1, title: 1, authors: 1, publishedDate: 1 });
  }

  async remove(removeBookDto: RemoveBookDto) {
    return this.bookRepository.findOneAndDelete({ _id: removeBookDto._id});
  }
}
