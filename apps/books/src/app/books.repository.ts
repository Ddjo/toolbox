import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BookDocument } from "./entities/book.entity";
import { DB_BOOKS_DOCUMENT } from "@constants";

@Injectable()
export class BookRepository extends AbstractRepository<BookDocument> {
    protected readonly logger = new Logger(BookRepository.name);

    constructor(
        @InjectModel(DB_BOOKS_DOCUMENT)
        protected readonly bookModel: Model<BookDocument>
    ) {
        super(bookModel);
    }
}