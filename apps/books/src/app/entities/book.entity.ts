import { AbstractDocument } from '@libs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({versionKey : false})
export class BookDocument extends AbstractDocument {

    @Prop({type: String, required: true})
    title: string
    
    @Prop({type: String, required: true})
    author: string;

    @Prop({type: Number})
    rating: number;

    @Prop({type: Date, required: true})
    releaseDate: Date

    @Prop()
    userId: string;
  
}

export const BookSchema = SchemaFactory.createForClass(BookDocument);