import { AbstractDocument } from '@libs/common';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, ObjectId, SchemaTypes } from 'mongoose';

@Schema({versionKey : false})
export class BookDocument extends AbstractDocument {

    @Prop({type: String, required: true})
    title: string
    
    @Prop({type: MongooseSchema.Types.Array, required: true})
    authors: string[];

    @Prop({type: Date, required: true})
    publishedDate: Date

    @Prop({ type: SchemaTypes.ObjectId })
    createdByUserId: ObjectId;    

    @Prop()
    creationDate: Date;

    @Prop({ type: SchemaTypes.ObjectId })
    updatedByUserId: ObjectId;
  
    @Prop()
    updateDate: Date;
}

export const BookSchema = SchemaFactory.createForClass(BookDocument);