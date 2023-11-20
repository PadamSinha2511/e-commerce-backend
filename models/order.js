const mongoose = require("mongoose")


const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        phoneNo:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true

    },
    orderItem:[{
        name:{
            type:{
                type:String,
                required:true
            }
        },
        quantity:{
            type:{
                type:Number,
                required:true
            }
        },
        image:{
            type:{
                type:String,
               
            }
        },
        price:{
            type:{
                type:Number,
                required:true
            }
        },
        product:{
            type:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true
            }
        },
    }],
    paymentInfo:{
        id:{
            type:String
        }
    },
    taxAmount:{
        type:Number,
        required:true
    },
    shippingAmount:{
        type:Number,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        enum:{
            values:[
                'processing',
                'shipped',
                'In-transit',
                'delivered'
            ],
            message:'Select the right value'
        },
        default:"processing"
    },
    deliveredAt:{
        type:Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
    

},{timestamps:true})


module.exports=mongoose.model("Order",orderSchema);