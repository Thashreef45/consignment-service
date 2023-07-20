import { Schema,Model } from "mongoose";

const storeSchema = new Schema({
    prefix:String,
    status:String,
    type:String,
    awbAvailabilty : {
        type :Number,
        default:10000000
    }
})

export default storeSchema