import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../../abstract.schema";

@Schema({versionKey : false})
export class UserDocument extends AbstractDocument {

    @Prop({type: String, required: true})
    email!: string

    @Prop({type: String, required: true})
    password!: string
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);