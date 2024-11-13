import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { BookDocument } from "./entities/book.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class BookRepository extends AbstractRepository<BookDocument> {
    protected readonly logger = new Logger(BookRepository.name);

    constructor(
        @InjectModel(BookDocument.name)
        protected readonly bookModel: Model<BookDocument>
    ) {
        super(bookModel);
    }
}