import { Request,Response } from "express"
import newConsignment from "../../application/usecase/consignment-booking"
export default {
    createConsignment : async(req:Request,res:Response) => {
        newConsignment(req.body)
    }
}