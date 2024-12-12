import { AbstractRepository } from "@libs/common";
import { Injectable, Logger } from "@nestjs/common";
import { UserDocument } from "./entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DB_USERS_DOCUMENT } from "@constants";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(UserRepository.name);

    constructor(
        @InjectModel(DB_USERS_DOCUMENT)
        protected readonly userModel: Model<UserDocument>
    ) {
        super(userModel);
    }
}