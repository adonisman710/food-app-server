import mongoose from "mongoose";
const dishSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    short_description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true
    }
})

export default mongoose.model("Dish", dishSchema);