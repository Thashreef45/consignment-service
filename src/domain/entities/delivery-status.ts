import { Schema,Model } from "mongoose";

const statusSchema = new Schema({
    statusName:String,
})

const statusModel = new Model('status-model',statusSchema)
export default statusModel