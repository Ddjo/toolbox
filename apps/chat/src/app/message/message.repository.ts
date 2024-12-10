import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MessageDocument } from "./entities/message.entity";

@Injectable()
export class MessageRepository extends AbstractRepository<MessageDocument> {
    protected readonly logger = new Logger( MessageRepository.name);

    constructor(
        @InjectModel(MessageDocument.name)
        protected readonly messageModel: Model<MessageDocument>
    ) {
        super(messageModel);
    }
}