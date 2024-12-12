import { DB_CHAT_ROOMS_DOCUMENT } from "@constants";
import { AbstractRepository, ChatRoomDocument } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RoomRepository extends AbstractRepository<ChatRoomDocument> {
    protected readonly logger = new Logger( RoomRepository.name);

    constructor(
        @InjectModel(DB_CHAT_ROOMS_DOCUMENT)
        protected readonly roomModel: Model<ChatRoomDocument>,

    ) {
        super(roomModel);
    }
}