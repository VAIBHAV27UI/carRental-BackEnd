import mongoose, { Schema } from "mongoose";

export const blogSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    information:{
        type:String,
        required:true
    }

}, {timestamps:true})

export default mongoose.model("Blog", blogSchema);
