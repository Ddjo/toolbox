import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { UserDocument } from "../../users/models";
import { ChatRoomDocument } from "./chat-room.entity";

@Schema({
    timestamps: true,
    versionKey: false,
})
export class ChatMessageDocument extends AbstractDocument {

    @Prop({ required: true })
    content!: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserDocument.name })
    sender!: UserDocument;
    
    @Prop({type: mongoose.Schema.Types.ObjectId, forwardRef:(() => ChatRoomDocument).name })
    chatRoom!: ChatRoomDocument;
}

export const MessageSchema = SchemaFactory.createForClass(ChatMessageDocument);
