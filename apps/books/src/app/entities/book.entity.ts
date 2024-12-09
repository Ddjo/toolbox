import { AbstractDocument, UserDocument } from '@libs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Schema as MongooseSchema } from 'mongoose';

@Schema({versionKey : false})
export class BookDocument extends AbstractDocument {

    @Prop({type: String, required: true})
    title: string
    
    @Prop({type: MongooseSchema.Types.Array, required: true})
    authors: string[];

    @Prop({type: Date, required: true})
    publishedDate: Date

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    createdByUser: UserDocument;

    @Prop({ type: Date, required: true })
    creationAt: Date;
  
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    updatedByUser:UserDocument;

    @Prop({ type: Date, required: true })
    updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(BookDocument);