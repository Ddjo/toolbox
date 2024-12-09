import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument, UserDocument } from "@libs/common";
import mongoose, { HydratedDocument, Types } from "mongoose";
// import { Room } from "../../rooms/schemas/room.schemas";


// export type MessageDocument = HydratedDocument<Message>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class MessageDocument extends AbstractDocument {

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserDocument.name, autopopulate: true })
    sender_id: UserDocument;

    // @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Room.name })
    // room_id: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);
