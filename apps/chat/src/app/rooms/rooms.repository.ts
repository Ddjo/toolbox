import { AbstractRepository, ChatRoomDocument } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class RoomRepository extends AbstractRepository<ChatRoomDocument> {
    protected readonly logger = new Logger( RoomRepository.name);

    constructor(
        @InjectModel(ChatRoomDocument.name)
        protected readonly roomModel: Model<ChatRoomDocument>,

    ) {
        super(roomModel);
    }
}