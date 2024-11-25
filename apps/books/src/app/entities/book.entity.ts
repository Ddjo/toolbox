import { AbstractDocument } from '@libs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';

@Schema({versionKey : false})
export class BookDocument extends AbstractDocument {

    @Prop({type: String, required: true})
    title: string
    
    @Prop({type: MongooseSchema.Types.Array, required: true})
    authors: string[];

    // @Prop({type: Number})
    // rating: number;

    @Prop({type: String, required: true})
    publishedDate: string

    @Prop()
    userId: string;
  
}

export const BookSchema = SchemaFactory.createForClass(BookDocument);