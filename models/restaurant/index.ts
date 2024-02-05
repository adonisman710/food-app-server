import mongoose from "mongoose";

const restaurantsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    short_description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    lat:{
        type:Number,
        required: true
    },
    long:{
        type:Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    categories:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Categories",
        }
    ],
    dishes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
        }
    ]

})

export default mongoose.model("Restaurants", restaurantsSchema);