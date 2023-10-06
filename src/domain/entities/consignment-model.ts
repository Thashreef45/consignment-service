import { model, Schema } from "mongoose";

const consignmetSchema = new Schema({
    awb: Number,
    awbPrefix: String,
    image: String,
    drs: String,
    mobile: Number,
    address: String,
    originAddress:String,
    weight: Number,
    // volume:String,
    charge: Number,
    declaredValue: Number,
    contentType:Schema.Types.ObjectId,
    status:Schema.Types.ObjectId,
    originPin: Number,
    destinationPin: Number,
    isDoc: Boolean,
    isReturned: {
        type: Boolean,
        default: false
    },
    isJustBooked: {
        type: Boolean,
        default: true
    },
    // isNotDelivered:{default:false,type:Boolean},
    bookingTime: {
        type: Date,
        default: Date.now()
    },

    sending: {
        nodalRecieved: Date,
        nodalSend: Date,
        apexRecieved: Date,
        apexSend: Date,
    },
    recieving: {
        apexRecieved: Date,
        apexSend: Date,
        nodalRecieved: Date,
        nodalSend: Date,
        cpRecieved: Date
    },
    notDelivered: {
        sending: {
            nodalRecieved: Date,
            nodalSend: Date,
            apexRecieved: Date,
            apexSend: Date,
        },
        recieving: {
            apexRecieved: Date,
            apexSend: Date,
            nodalRecieved: Date,
            nodalSend: Date,
            cpRecieved: Date
        }
    }
})

const Model = model('consignment', consignmetSchema)
export default Model