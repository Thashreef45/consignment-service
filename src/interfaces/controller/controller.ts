import { Request,Response } from "express"
import purchaseAwb from "../../application/usecase/buy-consignment"
import newConsignment from "../../application/usecase/consignment-booking"
import createAwb from "../../application/usecase/new-awb"
import createContent from "../../application/usecase/createContentType"
import createDeleveryStatus from "../../application/usecase/create-delevery-status"

export default {
    // bookConsignment : async(req:Request,res:Response) => {
    //     try {
    //         newConsignment(req.body)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },

    PurchaseAwb : async(call:any,callback:any) => {
        try {
            let response =await purchaseAwb(call.request)
            callback(null,response)
        } catch (error) {
            console.log(error)
        }
    },

    newBooking : async(call:any ,callback:any) => {
        try {
            const reponse = await newConsignment(call.request)
            callback(null,reponse)
        } catch (error) {
            console.log(error)
        }
    }

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