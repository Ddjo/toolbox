import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AbstractDocument } from "../../abstract.schema";
import { UserDocument } from "../../users/models";
import { ChatMessageDocument } from "./chat-message.entity";

// export type RoomDocument = HydratedDocument<Room>;


@Schema({
    timestamps: true,
    versionKey: false,
    // toJSON: ({
    //     transform(_, ret, __) {
    //         return new RoomDocument(ret);
    //     },
    // })
})
export class ChatRoomDocument extends AbstractDocument {

    @Prop()
    name!: string;
    
        // @Prop({ enum: RoomType, default: RoomType.PERSONAL })
        // type: RoomType;

        
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: UserDocument.name }], auto: true  })
    members!: UserDocument[];
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, forwardRef: (() => ChatMessageDocument).name }]  })
    messages!: ChatMessageDocument[];
}

export const RoomSchema = SchemaFactory.createForClass(ChatRoomDocument);

// export class RoomDocument {
//     _id: Types.ObjectId;
//     name: string;
//     type: RoomType;
//     members: User[];

//     constructor(props: Partial<RoomDocument>) {
//         this._id = props._id;
//         this.members = props.members;
//         this.name = props.name;
//         this.type = props.type;

//         if (this.type == RoomType.PERSONAL) {
//             this.name = this.members.find((member: any) => member._id.toString() !== this._id.toString()).name;
//         }
//     }
// }
