import { Model,Schema } from "mongoose";

const storeOrderModel = new Schema({
    purchaseDate: {
        type: Date,
        default: Date.now,
    },
    cpId:String,
    orders:[
        {
            id:String,
            awbFrom:Number,
            awbTo:Number,
        }
    ]
})

export default storeOrderModel
