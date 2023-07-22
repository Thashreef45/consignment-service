import connectDB from "../../utils/db-connection"
import Model from "../../domain/entities/consignment-model"

connectDB()

export default {
    newBooking : async (data:{}) => {
       return await Model.find()
    }
}