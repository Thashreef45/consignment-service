import { Schema,model } from "mongoose";

const awbSchema = new Schema({
    prefix:String,
    status:{
        type:Boolean,
        default:true
    },
    type:String,
    awbAvailability : {
        type :Number,
        default:10000000
    }
})

const awbModel = model('awb',awbSchema)
export default awbModel