import { DB_CHAT_MESSAGES_DOCUMENT } from "@constants";
import { AbstractRepository, ChatMessageDocument } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MessageRepository extends AbstractRepository<ChatMessageDocument> {
    protected readonly logger = new Logger( MessageRepository.name);

    constructor(
        @InjectModel(DB_CHAT_MESSAGES_DOCUMENT)
        protected readonly messageModel: Model<ChatMessageDocument>
    ) {
        super(messageModel);
    }
}