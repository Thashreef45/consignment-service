import { model,Schema } from "mongoose";

const consignmetSchema = new Schema({
    awb:Number,
    image:String,
    drs:String,
    bookingTime:Date,
    mobile:Number,
    address :{
        address:String,
        pincode:Number,
    },
    weight:String,
    volume:String,
    charge:Number,
    declaredValue:Number,
    contentType:String,
    originPin:Number,
    destinationPin:Number,
    type:String,            // doc / non doc
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

const Modal = model('consignment',consignmetSchema)
export default Modal