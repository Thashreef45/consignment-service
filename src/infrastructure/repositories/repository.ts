import connectDB from "../../utils/db-connection"
import awbModel, { AwbDocument } from "../../domain/entities/awb"
import Model from "../../domain/entities/consignment-model"
import storeOrderModel from "../../domain/entities/store-orders"
import { buyAwb, CreateAwb } from "../interfaces/interface"
import contentModel from "../../domain/entities/content-type"
import statusModel from "../../domain/entities/delivery-status"
import mongoose from "mongoose"
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
            isSameApex: data.isSameApex,
            status: data.statusId,
        })
        return await cretedData.save()
    },


    buyConsignment: async (key: string, value: number) => {
        return await awbModel.updateOne({ prefix: key }, { $inc: { awbAvailability: value } })
    },

    isExist: async (data: any): Promise<AwbDocument[]> => {
        return await awbModel.find(data)
    },

    lastUpdatedAwb: async (data: string): Promise<AwbDocument | null> => {
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

    BookingsReachedAtNodal: async (id: string, prefix: string, awb: number, address: string, name: string, statusId: string) => {
        const data = await Model.updateOne(
            { awbPrefix: prefix, awb: awb },
            {
                $set: {
                    isJustBooked: false,
                    "sending.nodalRecieved.address": address,
                    "sending.nodalRecieved.name": name,
                    "sending.nodalRecieved.Date": Date.now(),
                    "sending.nodalRecieved.id": id,
                    status: statusId
                },
            })
    },

    //check its a valid prefix 
    isValidPrefix: async (prefix: string): Promise<AwbDocument | null> => {
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
            }
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

    //get sending part apex reached consignment
    getByObjectIdAndApexID: async (id: string, apexId: string) => {
        return await Model.findOne(
            {
                _id: id,
                'sending.apexRecieved.id': apexId,
                'sending.apexSend': { $exists: false }
            }
        )
    },

    NodaltoCpSendPart: async (id: string, address: string, cpId: string, name: string, statusId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'sending.nodalSend': Date.now(),
                    'recieving.cpRecieved.Date': Date.now(),
                    'recieving.cpRecieved.id': cpId,
                    'recieving.cpRecieved.name': name,
                    'recieving.cpRecieved.address': address,
                    status: statusId
                }
            }
        )
    },

    NodalToApexSendPart: async (id: string, address: string, apexId: string, name: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'sending.nodalSend': Date.now(),
                    'sending.apexRecieved.Date': Date.now(),
                    'sending.apexRecieved.id': apexId,
                    'sending.apexRecieved.name': name,
                    'sending.apexRecieved.address': address,
                }
            }
        )
    },

    getCpRecievedFdms: async (id: string) => {
        console.log(id)
        return await Model.aggregate([
            {
                $match: {
                    $or: [
                        {
                            'recieving.cpRecieved.id': id,
                            deliveryAssignedTo: { $exists: false },
                            'recieving.cpUpdate': { $exists: false },
                        },
                        {
                            'deliveryAssignedTo.return': { $exists: false },
                            'notDelivered.recieving.cpRecieved.id': id,
                            'notDelivered.recieving.cpUpdate': { $exists: false }
                        }
                    ]
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
            }
        ])
    },

    getApexSendingFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'sending.apexRecieved.id': id,
                    'sending.apexSend': { $exists: false }
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
            },
        ])
    },

    updateNodalRecievedFromApex: async (data: { id: string, address: string, name: string }, id: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'sending.apexSend': Date.now(),
                    'recieving.nodalRecieved.name': data.name,
                    'recieving.nodalRecieved.address': data.address,
                    'recieving.nodalRecieved.Date': Date.now(),
                    'recieving.nodalRecieved.id': data.id,
                }
            }
        )
    },

    getNodalRecievedFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'recieving.nodalRecieved.id': id,
                    'recieving.nodalSend': { $exists: false }
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
            },
        ])
    },

    updateFdmRecievedAtCP: async (cpId: string, address: string, name: string, prefix: string, awb: number, id: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    "recieving.nodalSend": Date.now(),
                    "recieving.cpRecieved.id": cpId,
                    "recieving.cpRecieved.name": name,
                    "recieving.cpRecieved.address": address,
                    "recieving.cpRecieved.Date": Date.now()
                }
            }
        )
    },

    updateAfterApexToApexTransfer: async (id: string, apexId: string, name: string, address: string) => {
        return await Model.updateOne(
            {
                _id: id,
                'sending.apexSend': { $exists: false }
            },
            {
                $set: {
                    'sending.apexSend': Date.now(),
                    'recieving.apexRecieved.id': apexId,
                    'recieving.apexRecieved.name': name,
                    'recieving.apexRecieved.address': address,
                    'recieving.apexRecieved.Date': Date.now()
                }
            }
        )
    },

    getApexRecievedFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'recieving.apexRecieved.id': id,
                    'recieving.apexSend': { $exists: false }
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
            },
        ])
    },

    trasferFdmFromApexRecievedToNodalRecieved: async (id: string, nodalId: string, name: string, address: string) => {
        return await Model.updateOne(
            {
                _id: id,
                'recieving.apexSend': { $exists: false }
            },
            {
                $set: {
                    'recieving.apexSend': Date.now(),
                    'recieving.nodalRecieved.id': nodalId,
                    'recieving.nodalRecieved.name': name,
                    'recieving.nodalRecieved.address': address,
                    'recieving.nodalRecieved.Date': Date.now()
                }
            }
        )
    },

    assignFdmtoEmployee: async (id: string, empId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'deliveryAssignedTo.delivery': empId
                }
            }
        )
    },

    assignRTOFdmtoEmployee: async (id: string, empId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'deliveryAssignedTo.return': empId
                }
            }
        )
    },



    getEmployeeAssignedFdms: async (id: mongoose.Types.ObjectId) => {
        return await Model.aggregate([
            {
                $match: {
                    $or:
                        [
                            { 'deliveryAssignedTo.delivery': id, 'recieving.cpUpdate': { $exists: false } },
                            { 'deliveryAssignedTo.return': id, 'notDelivered.recieving.cpUpdate': { $exists: false } }
                        ],
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

    getAllDeliveryStatus: async () => {
        return await statusModel.find()
    },


    getDeliveryStatus: async () => {
        return await statusModel.aggregate([
            {
                $match: {
                    statusName: { $nin: ['Booked', 'Intransist', 'Out for delivery'] }
                }
            }
        ])
    },

    getDeliveryStatusById: async (id: string) => {
        return await statusModel.findOne({ _id: id })
    },


    updateDelivered: async (id: string, status: string, image: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'recieving.cpUpdate': Date.now(),
                    status: status,
                    drs: image
                }
            }
        )
    },

    updateRTPDelivery: async (id: string, image: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.recieving.cpUpdate': Date.now(),
                    drs: image
                }
            }
        )
    },

    updateReturnFromCpToNodal: async (id: string, status: string, image: string, address: string, name: string, nodalId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'recieving.cpUpdate': Date.now(),
                    'notDelivered.sending.nodalRecieved.Date': Date.now(),
                    'notDelivered.sending.nodalRecieved.name': name,
                    'notDelivered.sending.nodalRecieved.address': address,
                    'notDelivered.sending.nodalRecieved.id': nodalId,
                    status: status,
                    drs: image,
                    isReturned: true
                }
            }
        )
    },


    getNodalReturnedSendingFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'notDelivered.sending.nodalRecieved.id': id,
                    'notDelivered.sending.nodalSend': { $exists: false }
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

    transferReturnFromNodalSendignToCpRecieving: async (id: string, address: string, name: string, cpId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.sending.nodalSend': Date.now(),
                    'notDelivered.recieving.cpRecieved.Date': Date.now(),
                    'notDelivered.recieving.cpRecieved.name': name,
                    'notDelivered.recieving.cpRecieved.address': address,
                    'notDelivered.recieving.cpRecieved.id': cpId,
                }
            }
        )
    },


    //working on it
    getApexReturnedSendingFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'notDelivered.sending.apexRecieved.id': id,
                    'notDelivered.sending.apexSend': { $exists: false }
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




    transferReturnFromNodalSendingToApexSending: async (id: string, name: String, address: String, apexId: String) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.sending.nodalSend': Date.now(),
                    'notDelivered.sending.apexRecieved.Date': Date.now(),
                    'notDelivered.sending.apexRecieved.id': apexId,
                    'notDelivered.sending.apexRecieved.name': name,
                    'notDelivered.sending.apexRecieved.address': address,
                }
            }
        )
    },


    transferReturnFromApexSendingToNodalRecieving: async (id: string, name: String, address: String, nodalId: String) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.sending.apexSend': Date.now(),
                    'notDelivered.recieving.nodalRecieved.Date': Date.now(),
                    'notDelivered.recieving.nodalRecieved.id': nodalId,
                    'notDelivered.recieving.nodalRecieved.name': name,
                    'notDelivered.recieving.nodalRecieved.address': address,
                }
            }
        )
    },


    //pending here
    transferReturnFromApexSendingToApexRecieving: async (id: string, name: String, address: String, apexId: String) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.sending.apexSend': Date.now(),
                    'notDelivered.recieving.apexRecieved.Date': Date.now(),
                    'notDelivered.recieving.apexRecieved.id': apexId,
                    'notDelivered.recieving.apexRecieved.name': name,
                    'notDelivered.recieving.apexRecieved.address': address,
                }
            }
        )
    },


    getNodalReturnedRecievedFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'notDelivered.recieving.nodalRecieved.id': id,
                    'notDelivered.recieving.nodalSend': { $exists: false }
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

    transferReturnFromNodalRecievedToCpRecieving: async (id: string, address: string, name: string, cpId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.recieving.nodalSend': Date.now(),
                    'notDelivered.recieving.cpRecieved.Date': Date.now(),
                    'notDelivered.recieving.cpRecieved.name': name,
                    'notDelivered.recieving.cpRecieved.address': address,
                    'notDelivered.recieving.cpRecieved.id': cpId,
                }
            }
        )
    },


    getApexReturnedRecievedFdms: async (id: string) => {
        return await Model.aggregate([
            {
                $match: {
                    'notDelivered.recieving.apexRecieved.id': id,
                    'notDelivered.recieving.apexSend': { $exists: false }
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

    transferReturnApexRecievingToNodalRecieving: async (id: string, address: string, name: string, nodalId: string) => {
        return await Model.updateOne(
            { _id: id },
            {
                $set: {
                    'notDelivered.recieving.apexSend': Date.now(),
                    'notDelivered.recieving.nodalRecieved.Date': Date.now(),
                    'notDelivered.recieving.nodalRecieved.name': name,
                    'notDelivered.recieving.nodalRecieved.address': address,
                    'notDelivered.recieving.nodalRecieved.id': nodalId,
                }
            }
        )
    },



    // transferReturnFromApexSendingToNodalRecieving : async (id:string,name:String , address:String,nodalId:String) => {
    //     return await Model.updateOne(
    //         {_id:id},
    //         {
    //             $set : {
    //                 'notDelivered.sending.apexSend': Date.now(),
    //                 'notDelivered.recieving.nodalRecieved.Date' : Date.now(),
    //                 'notDelivered.recieving.nodalRecieved.id':nodalId,
    //                 'notDelivered.recieving.nodalRecieved.name' : name,
    //                 'notDelivered.recieving.nodalRecieved.address' : address,
    //             }
    //         }
    //     )
    // },

}
