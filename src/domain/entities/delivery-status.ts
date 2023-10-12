import { Schema,model } from "mongoose";

const statusSchema = new Schema({
    statusName:String,
})

const statusModel = model('status-model',statusSchema)
export default statusModel