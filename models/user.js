const mongoose = require('mongoose');
const validator =  require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto")

const userSchema =new  mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        validate:[validator.isEmail,'Please enter email in the correct format'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        select:false
    },
    role:{
        type:String,
        default:'user'

    },
    photo:{
        id:{
            type:String,
            default:""
         
        },
        secure_url:{
            type:String,
            default:""
           
        }
    },
    forgotPasswordToken:{
        type:String,
    },
    forgotPasswordExpiry:{
        type:Date
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10);

})

userSchema.method('matchPassword',function(clientPassword){
   
    return bcrypt.compare(clientPassword,this.password);
})


userSchema.method('getForgotPasswordToeken',function()
{
    const forgotToken = crypto.randomBytes(10).toString('hex');

    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    this.forgotPasswordExpiry = Date.now()+2*60*1000;

    return forgotToken;
})


userSchema.method('verifyForgotToken',function(forgotToken)
{
    const hashedClientToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    if(hashedClientToken !== this.forgotPasswordToken) return false
    
    return true
})




const User = mongoose.model('user',userSchema);

module.exports=User;