import { AbstractDocument, UserDocument } from "@libs/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { RoomDocument } from "../../rooms/entities/room.entity";

@Schema({
    timestamps: true,
    versionKey: false,
})
export class MessageDocument extends AbstractDocument {

    @Prop({ required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserDocument.name })
    sender: UserDocument;
    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: RoomDocument.name })
    chatRoom: RoomDocument;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
