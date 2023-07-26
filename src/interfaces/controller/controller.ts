import { Request,Response } from "express"
import newConsignment from "../../application/usecase/consignment-booking"
import purchaseConsignment from "../../application/usecase/buy-consignment"
export default {
    createConsignment : async(req:Request,res:Response) => {
        try {
            newConsignment(req.body)
        } catch (error) {
            console.log(error)
        }
    },

    purchaseConsignment : async(req:Request,res:Response) => {
        try {
            purchaseConsignment(req.body,req.headers)
        } catch (error) {
            console.log(error)
        }
    }
}