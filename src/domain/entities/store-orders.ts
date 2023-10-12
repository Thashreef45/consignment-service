import { model, Schema } from "mongoose";

const storeOrderSchema = new Schema({
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    cpId: String,
    prefix: String,
    awbFrom: Number,
    awbTo: Number,
})

const storeOrderModel = model('awb-order',storeOrderSchema)
export default storeOrderModel
