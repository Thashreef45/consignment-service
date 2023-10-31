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

    // Destiation
    isSameNodal : {
        type:Boolean,
        default : false
    },
    isSameApex : {
        type: Boolean,
        default:false,
    },
    

    isReturned: {
        type: Boolean,
        default: false
    },
    isJustBooked: {
        type: Boolean,
        default: true
    },
    bookingTime: {
        type: Date,
        default: Date.now()
    },

    deliveryAssignedTo : {
        delivery :Schema.Types.ObjectId,
        return : Schema.Types.ObjectId
    },
    
    sending: {
        nodalRecieved: {name:String , address:String,Date:Date,id:String},
        nodalSend: Date,
        apexRecieved: {name:String , address:String,Date:Date,id:String},
        apexSend: Date,
    },
    recieving: {
        apexRecieved: {name:String , address:String,Date:Date,id:String},
        apexSend: Date,
        nodalRecieved:{name:String , address:String,Date:Date,id:String},
        nodalSend: Date,
        cpRecieved: {name:String , address:String,Date:Date,id:String},
        cpUpdate : Date
    },
    notDelivered: {
        sending: {
            nodalRecieved: {name:String , address:String,Date:Date,id:String},
            nodalSend: Date,
            apexRecieved: {name:String , address:String,Date:Date,id:String},
            apexSend: Date,
        },
        recieving: {
            apexRecieved: {name:String , address:String,Date:Date,id:String},
            apexSend: Date,
            nodalRecieved:{name:String , address:String,Date:Date,id:String},
            nodalSend: Date,
            cpRecieved: {name:String , address:String,Date:Date,id:String},
            cpUpdate : Date
        }
    }
})

const Model = model('consignment', consignmetSchema)
export default Model