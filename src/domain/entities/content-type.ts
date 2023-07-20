import { Schema, Model } from "mongoose";


const contentType = new Schema({
    typeName : String,
})


const contentModel = new Model('content-model',contentType)
export default contentModel