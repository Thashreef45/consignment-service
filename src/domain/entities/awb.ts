import { Document, Model, Schema, model } from "mongoose";

export interface AwbDocument extends Document {
    prefix: string;
    status: boolean;
    type: string;
    awbAvailability: number;
}

const awbSchema = new Schema<AwbDocument>({
    prefix: String,
    status: {
        type: Boolean,
        default: true
    },
    type: String,
    awbAvailability: {
        type: Number,
        default: 10000000
    }
});

const awbModel: Model<AwbDocument> = model('awb', awbSchema);

export default awbModel;
