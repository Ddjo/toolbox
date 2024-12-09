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

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserDocument.name, autopopulate: true })
    sender: UserDocument;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: RoomDocument.name })
    room_id: RoomDocument;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
