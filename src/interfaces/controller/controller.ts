import { Request,Response } from "express"
import newConsignment from "../../application/usecase/consignment-booking"
import purchaseConsignment from "../../application/usecase/buy-consignment"
import createAwb from "../../application/usecase/new-awb"

export default {
    createConsignment : async(req:Request,res:Response) => {
        try {
            newConsignment(req.body)
        } catch (error) {
            console.log(error)
        }
    },

    PurchaseConsignment : async(req:Request,res:Response) => {
        try {
            purchaseConsignment(req.body,String(req.headers.token))
        } catch (error) {
            console.log(error)
        }
    },

    CreateAwb : async(req:Request , res:Response) => {
        try {
            createAwb(req.body)
        } catch (error) {
            
        }
    }


}