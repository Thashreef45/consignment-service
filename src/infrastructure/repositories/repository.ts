import connectDB from "../../utils/db-connection"
import awbModel from "../../domain/entities/awb"
import Model from "../../domain/entities/consignment-model"
import storeOrderModel from "../../domain/entities/store-orders"
import { buyAwb, CreateAwb } from "../interfaces/interface"
import contentModel from "../../domain/entities/content-type"
import statusModel from "../../domain/entities/delivery-status"
connectDB()

export default {
    newBooking: async (data: any) => {
        let cretedData = new Model({
            awb: data.awb,
            awbPrefix: data.awbPrefix,
            image: data.image,
            cpId: data.id,
            originPin: data.originPin,
            address: data.address,
            destinationPin: data.pincode,
            isDoc: data.isDoc,
            originAddress: data.originAddress,
            contentType: data.contentType,
            mobile: data.mobile,
            declaredValue: data.declaredValue,
            isSameNodal: data.isSameNodal,
            isSameApex: data.isSameNodal,
            status: '65242b1ae176246b91a399c3'
        })
        return await cretedData.save()
    },


    buyConsignment: async (key: string, value: number) => {
        return await awbModel.updateOne({ prefix: key }, { $inc: { awbAvailability: value } })
    },




    isExist: async (data: any) => {
        return await awbModel.find(data)
    },

    lastUpdatedAwb: async (data: string) => {
        return await awbModel.findOne({ prefix: data })
    },

    //Creating a new Awb Here
    createAwb: async (data: CreateAwb) => {
        const newData = new awbModel(data)
        newData.save()
        return data
    },

    //creating a new type for consignment
    createNewConsignmentType: async (typeName: string) => {
        const newData = new contentModel({ typeName: typeName })
        return newData.save()
    },

    //creating a delevery status 
    createNewDeleveryStatus: async (status: string) => {
        const newStatus = new statusModel({ statusName: status })
        return newStatus.save()
    },

    //creating a new order in awb store-order
    awbNewOrder: async (data: buyAwb) => {
        const createOrder = new storeOrderModel(data)
        createOrder.save()
    },

    //get content types
    getTypes: async () => {
        return await contentModel.find()
    },


    // get todays bookings for cp before transfering fdm ,
    getTodaysBookings: async (pincode: number) => {

        let data = await Model.aggregate([
            {
                $match: { originPin: pincode, isJustBooked: true }
            },
            {
                $lookup: { from: 'content-types', localField: 'contentType', foreignField: '_id', as: 'type' }
            },
            {
                $unwind: '$type'
            },
            {
                $project: { 'type._id': 0 }
            },
            {
                $set: { type: '$type.typeName' }
            }
        ]);

        return data
    },


    getAwb: async (id: string) => {
        return await Model.findOne({ _id: id }, { awbPrefix: 1, awb: 1, _id: 0 })
    },

    deleteBooking: async (id: string) => {
        return await Model.deleteOne({ _id: id })
    },

    getBookingHistory: async (data: any) => {

        return await Model.aggregate([
            {
                $match: {
                    originPin: data.pincode,
                    bookingTime: { $gte: data.from, $lt: data.to },
                    isJustBooked: false
                }
            },
            {
                $lookup: { from: 'content-types', localField: 'contentType', foreignField: '_id', as: 'type' }
            },
            {
                $unwind: '$type'
            },
            {
                $set: { type: '$type.typeName' }
            },
            {
                $lookup: { from: "status-models", localField: 'status', foreignField: '_id', as: 'status' }
            },
            {
                $unwind: '$status'
            },
            {
                $set: { status: "$status.statusName" }
            }
        ])
    },

    BookingsReachedAtNodal: async (id: string, prefix: string, awb: number, address: string, name: string) => {
        const data = await Model.updateOne(
            { awbPrefix: prefix, awb: awb },
            {
                $set: {
                    isJustBooked: false,
                    "sending.nodalRecieved.address": address,
                    "sending.nodalRecieved.name": name,
                    "sending.nodalRecieved.Date": Date.now(),
                    "sending.nodalRecieved.id": id,
                    status: '65154b2c674c55fd5fd6b491'
                },
            })
    },

    //check its a valid prefix 
    isValidPrefix: async (prefix: string) => {
        return await awbModel.findOne({ prefix: prefix })
    },

    Track: async (prefix: string, awb: string) => {
        return await Model.aggregate([
            {
                $match: { awbPrefix: prefix, awb: Number(awb) }
            },
            {
                $lookup: { from: 'content-types', localField: 'contentType', foreignField: '_id', as: 'type' }
            },
            {
                $unwind: '$type'
            },
            {
                $set: { contentType: '$type.typeName' }
            },
            {
                $lookup: { from: "status-models", localField: 'status', foreignField: '_id', as: 'status' }
            },
            {
                $unwind: '$status'
            },
            {
                $set: { status: "$status.statusName" }
            },
        ])
    },


    getNodalSendFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    "sending.nodalRecieved.id": id,
                    "sending.nodalSend": { $exists: false }
                },
            },
            {
                $lookup: { from: 'content-types', localField: 'contentType', foreignField: '_id', as: 'type' }
            },
            {
                $unwind: '$type'
            },
            {
                $set: { type: '$type.typeName' }
            },
            {
                $lookup: { from: "status-models", localField: 'status', foreignField: '_id', as: 'status' }
            },
            {
                $unwind: '$status'
            },
            {
                $set: { status: "$status.statusName" }
            },

        ])
    },

    getByObjectId: async (id: string) => {
        return await Model.findOne({ _id: id })
    },


    NodaltoCpSendPart: async (id: string, address: string, cpId: string, name: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'sending.nodalSend':Date.now(),
                    'recieving.cpRecieved.Date':Date.now(),
                    'recieving.cpRecieved.id':cpId,
                    'recieving.cpRecieved.name':name,
                    'recieving.cpRecieved.address':address,
                }
            }
        )
    }

}


