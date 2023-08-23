import connectDB from "../../utils/db-connection"
import awbModel from "../../domain/entities/awb"
import Model from "../../domain/entities/consignment-model"
import storeOrderModel from "../../domain/entities/store-orders"
import { buyAwb,CreateAwb } from "../interfaces/interface"
import contentModel from "../../domain/entities/content-type"
connectDB()

export default {
    newBooking : async (data:{}) => {
    //    return await Model.find()
    },

    buyConsignment : async(key:string, value:number) => {
       return await awbModel.updateOne({prefix:key},{$inc : {awbAvailability:value}})
    },



    
    isExist : async(data:any) =>{
        return await awbModel.find(data)
    },

    lastUpdatedAwb: async(data:string) =>{
        return await awbModel.findOne({prefix:data})
    },

    //Creating a new Awb Here
    createAwb : async(data:CreateAwb) => {
        const newData = new awbModel(data)
        newData.save()
        return data
    },

    //creating a new type for consignment
    createNewConsignmentType : async(typeName:string) => {
        const newData = new contentModel({typeName:typeName})
        return newData.save()
    },



    //creating a new order in awb store-order
    awbNewOrder : async(data:buyAwb)=>{
       const createOrder = new storeOrderModel(data)
       createOrder.save()
    }
}