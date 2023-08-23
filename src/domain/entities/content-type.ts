import { Schema, model } from "mongoose";


const contentType = new Schema({
    typeName : String,
})


const contentModel = model('content-type',contentType)
export default contentModel