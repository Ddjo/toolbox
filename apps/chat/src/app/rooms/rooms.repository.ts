import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RoomDocument } from "./entities/room.entity";

@Injectable()
export class RoomRepository extends AbstractRepository<RoomDocument> {
    protected readonly logger = new Logger( RoomRepository.name);

    constructor(
        @InjectModel(RoomDocument.name)
        protected readonly roomModel: Model<RoomDocument>
    ) {
        super(roomModel);
    }
}