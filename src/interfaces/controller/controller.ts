import { Request,Response } from "express"
import newConsignment from "../../application/usecase/consignment-booking"
import purchaseAwb from "../../application/usecase/buy-consignment"
import createAwb from "../../application/usecase/new-awb"

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


}