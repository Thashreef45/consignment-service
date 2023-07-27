import connectDB from "../../utils/db-connection"
import awbModel from "../../domain/entities/consignment-store"
import Model from "../../domain/entities/consignment-model"
import { CreateAwb } from "../../domain/interface/awb"
connectDB()

export default {
    newBooking : async (data:{}) => {
       return await Model.find()
    },
    buyConsignment : async(key:any, value:number) => {
        await awbModel.updateOne({prefix:key},{$inc : {awbAvailabilty:value}})
    },
    availablityCheck : async(data:any) =>{
        return await awbModel.find({},{data})
    },
    createAwb : async(data:CreateAwb)=> {
        const newData = new awbModel(data)
        newData.save()
    }
}