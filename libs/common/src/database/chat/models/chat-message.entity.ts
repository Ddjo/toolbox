import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { UserDocument } from "../../users/models";
import { ChatRoomDocument } from "./chat-room.entity";
import { DB_CHAT_ROOMS_DOCUMENT, DB_USERS_DOCUMENT } from "@constants";

@Schema({
    timestamps: true,
    versionKey: false,
})
export class ChatMessageDocument extends AbstractDocument {

    @Prop({ required: true })
    content!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DB_USERS_DOCUMENT })
    sender!: UserDocument;

    @Prop({
        type: [
          {
            user: { type: mongoose.Schema.Types.ObjectId, ref: DB_USERS_DOCUMENT },
            viewedAt: { type: Date },
          },
        ],
        default: [],
      })
    views!: { user: UserDocument; viewedAt: Date }[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:DB_CHAT_ROOMS_DOCUMENT })
    chatRoomId!: mongoose.Schema.Types.ObjectId;

}

export const MessageSchema = SchemaFactory.createForClass(ChatMessageDocument);
