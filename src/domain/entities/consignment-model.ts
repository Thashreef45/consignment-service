import { model,Schema } from "mongoose";

const consignmetSchema = new Schema({
    awb:Number,
    awbPrefix:String,
    image:String,
    drs:String,
    bookingTime:{
        type : Date,
        default : Date.now()
    },
    mobile:Number,
    address :{
        address:String,
        pincode:Number,
    },
    weight:Number,
    // volume:String,
    charge:Number,
    declaredValue:Number,
    contentType:String,
    originPin:Number,
    destinationPin:Number,
    isDoc:Boolean,
    sending :{
        nodalRecieved :Date,
        nodalSend:Date,
        apexRecieved:Date,
        apexSend:Date,
    },
    recieving:{
        apexRecieved:Date,
        apexSend:Date,
        nodalRecieved :Date,
        nodalSend:Date,
        cpRecieved:Date
    },
    notDelivered : {
        sending :{
            nodalRecieved :Date,
            nodalSend:Date,
            apexRecieved:Date,
            apexSend:Date,
        },
        recieving:{
            apexRecieved:Date,
            apexSend:Date,
            nodalRecieved :Date,
            nodalSend:Date,
            cpRecieved:Date
        }
    }
})

const Model = model('consignment',consignmetSchema)
export default Model