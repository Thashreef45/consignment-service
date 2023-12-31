import { Request, Response, response } from "express"
import purchaseAwb from "../../application/usecase/buy-consignment"
import newConsignment from "../../application/usecase/consignment-booking"
import createAwb from "../../application/usecase/new-awb"
import createContent from "../../application/usecase/createContentType"
import createDeleveryStatus from "../../application/usecase/create-delevery-status"
import { BuyAwbCall, GrpcCallBack, NewBooking } from "../types/interfaces"
import ConsignmentTypes from "../../application/usecase/get-consignment-types"
import todaysBooking from "../../application/usecase/cp-today-bookings"
import deleteBooking from "../../application/usecase/delete-booking"
import getBookingHistory from "../../application/usecase/get-booking-history"
import { GrpcObject } from "@grpc/grpc-js"
import trackConsignment from "../../application/usecase/track-consignment"
import getNodalSendFdms from "../../application/usecase/nodal-send-fdms"
import transferNodalSendingFdm from "../../application/usecase/transfer-nodal-sending-fdm"
import getCpRecievedFdms from "../../application/usecase/get-cp-recieved-fdms"
import getApexSendingFdms from "../../application/usecase/get-apex-sending-fdms"
import transferApexSendingFdm from "../../application/usecase/transfer-apex-sending-fdms"
import NodalRecievedFdms from "../../application/usecase/get-nodal-recieved-fdms"
import sendFdmFromNodalRecieved from "../../application/usecase/transfer-from-nodal-recieved"
import getApexRecievedFdms from "../../application/usecase/get-apex-recieved-fdms"
import transferApexRecievedFdms from "../../application/usecase/transfer-apex-recieved-fdm"
import assignFdmToEmployee from "../../application/usecase/assign-fdm-to-employee"
import getAssignedFdms from "../../application/usecase/get-assigned-fdms"
import getDeliveryStatus from "../../application/usecase/get-delivery-status"
import updateDeliveryStatus from "../../application/usecase/update-delivery-status"
import getNodalReturnSendingFdms from "../../application/usecase/nodal-return-sending-fdms"
import transferNodalSendingReturnedFdm from "../../application/usecase/transfer-returned-nodal-sending-fdm"
import getApexSendingReturnedFdms from "../../application/usecase/get-returned-apex-sending-fdms"
import transferApexSendingReturnFDM from "../../application/usecase/transfer-returned-apex-sending"
import getNodalReturnRecievedFdms from "../../application/usecase/get-nodal-return-recieved-fdms"
import transferNodalReturnRecievedFdm from "../../application/usecase/transfer-nodal-return-recieved-fdm"
import getReturnedApexRecievedFdms from "../../application/usecase/get-returned-apex-recieved-fdms"
import transferApexReturnRecievedFdms from "../../application/usecase/transfer-apex-return-recieved"


export default {
    // bookConsignment : async(req:Request,res:Response) => {
    //     try {
    //         newConsignment(req.body)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },

    PurchaseAwb: async (call: any, callback: GrpcCallBack) => {
        try {
            let response = await purchaseAwb(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    newBooking : async (call: NewBooking, callback: GrpcCallBack) => {
        try {
            const reponse = await newConsignment(call.request)
            callback(null, reponse)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    getConsignmentTypes: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await ConsignmentTypes()
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getTodaysBookings: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await todaysBooking(call.request.pincode)
            callback(null, response)
        } catch (error) {

        }
    },

    deleteBooking: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await deleteBooking(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    getBookingHistory: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getBookingHistory(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    consignmentTracking: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await trackConsignment(call.request.awb)
            callback(null, response)

        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getNodalSendFdms: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getNodalSendFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    transferNodalSendingFdm: async (call: any, callback: GrpcCallBack) => {
        try {
            const reponse = await transferNodalSendingFdm(call.request)
            callback(null, { status: 200, message: 'sucess' })
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getCpRecievedFdms: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getCpRecievedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getApexSendingFdm: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getApexSendingFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    sendApexSendingFdm: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferApexSendingFdm(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getNodalRecievedFdms: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await NodalRecievedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    transferFdmfromNodalRecieved: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await sendFdmFromNodalRecieved(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    getApexRecievedFdms: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getApexRecievedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    transferFdmFromApexRecieved : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferApexRecievedFdms(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    assignFdmtoEmployee : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await assignFdmToEmployee(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    }, 

    getEmployeeAssignedConsignments : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getAssignedFdms(call.request.id)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    }, 

    getDeliveryStatus : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getDeliveryStatus()
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    updateDeliveryStatus : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await updateDeliveryStatus(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getNodalSendingReturnFdms : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getNodalReturnSendingFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    transferNodalSendingReturned : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferNodalSendingReturnedFdm(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getApexSendingReturnFdms : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getApexSendingReturnedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },


    transferApexSendingReturned : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferApexSendingReturnFDM(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getNodalRecievedReturnFdms : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getNodalReturnRecievedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    transferNodalReturnRecievedFdm : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferNodalReturnRecievedFdm(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    getApexRecievedReturnFdms : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await getReturnedApexRecievedFdms(call.request.token)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },

    transferApexReturnRecieved : async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await transferApexReturnRecievedFdms(call.request)
            callback(null, response)
        } catch (error) {
            callback(null, { status: 500, message: 'Internal Server Error' })
        }
    },





    // CreateAwb : async(req:Request , res:Response) => {
    //     try {
    //        let response =await createAwb(req.body)
    //        if(response.message == 'success'){
    //         res.status(201).json(response)
    //        }else res.status(409).json(response)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }



    // createConsignmentType : async(req:Request,res:Response)=>{
    //     const data:string = req.body.typeName
    //     const response = await createContent(data)
    // },


    // createStatus:async(req:Request,res:Response)=>{
    //     const status = req.body.status
    //     return await createDeleveryStatus(status)
    // }


}