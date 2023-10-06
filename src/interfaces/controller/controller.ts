import { Request, Response } from "express"
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
            console.log(error)
        }
    },

    newBooking: async (call: NewBooking, callback: GrpcCallBack) => {
        try {
            const reponse = await newConsignment(call.request)
            callback(null, reponse)
        } catch (error) {
            console.log(error)
        }
    },


    getConsignmentTypes: async (call: any, callback: GrpcCallBack) => {
        try {
            const response = await ConsignmentTypes()
            callback(null, response)
        } catch (error) {
            console.log(error);
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
            callback(null,response)
        } catch (error) {

        }
    },


    getBookingHistory : async(call:any,callback:GrpcCallBack) => {
        try {
            getBookingHistory(call.request)
        } catch (error) {
            
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