import mongoose from "mongoose";

const featuredSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    short_description:{
        type: String,
        required: true
    },
    restaurants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurants",
        }
    ]
})

export default mongoose.model("Featured", featuredSchema);