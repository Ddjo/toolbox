import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { UserDocument } from "./models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(UserDocument.name)
        protected readonly userModel: Model<UserDocument>
    ) {
        super(userModel);
    }
}