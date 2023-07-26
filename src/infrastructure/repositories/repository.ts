import connectDB from "../../utils/db-connection"
import Model from "../../domain/entities/consignment-model"

connectDB()

export default {
    newBooking : async (data:{}) => {
       return await Model.find()
    },
    buyConsignment : async(key:any, value:number) => {
        await Model.updateOne({prefix:key},{$inc : {awbAvailabilty:value}})
    },
    availablityCheck : async(data:any) =>{
        return await Model.find({},data)
    }
}