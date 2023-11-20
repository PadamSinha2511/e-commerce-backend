const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide product name"],
        trim:true,
        maxLength:[120,"Product should not be more than 120 characters"]
    },
    price:{
        type:Number,
        required:[true,"Please provide product price"],
        maxLength:[5,"Product should not be more than 5 digits"]
    },
    description:{
        type:String,
        required:[true,"Please provide product description"],
    },
    photos:[{
        id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,"Please select category"],
        enum:{
            values:[
                'shortsleeves',
                'longsleeves',
                'sweatshirt',
                'hoodies'
            ],
            message:"Please select category from available"
        }
    },
    stock:{
        type:Number,
        required:[true,"Please add the stock value"]
    },
    brand:{
        type:String,
        required:[true,"Please provide product brand"],
        maxLength:[120,"Product should not be more than 120 digits"]
    },
    ratings:{
        type:Number,
        default:0,
    },
    numberOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User'
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
       
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})


module.exports = mongoose.model("Product",productSchema)