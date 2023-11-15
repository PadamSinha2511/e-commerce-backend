const User = require("../models/user");
const { generateJwtToken } = require("../utils/JwtTokenService");
const cloudinary = require("cloudinary");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto")


//authentication controllers

async function handleSignup(req,res){
    try {
        let result;
        if(req.files)
        {
            let file = req.files.photo
           
             result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
                folder:"users"
            })
        }


        const {name,email,password} = req.body;

        if(!email || !name || !password)
        {
            return res.status(404).json({success:false,msg:"Name or email or password is not found"});
        }

       const newUser = await User.create({
            name,
            email,
            password,
            photo:{
                id:result.public_id,
                secure_url:result.secure_url
            }
        })
        newUser.password = undefined
        const token = generateJwtToken(newUser)

        const options = {
            expires:new Date(
                Date.now()+ 3*24*60*60*1000
            ),
            httpOnly:true
        }

        return res.status(200).cookie('token',token,options).json({success:true,token,newUser,msg:"User created successfully"});

    } catch (error) {
        console.log(error);
        return res.status(400).json({success:false,msg:"User not created"});
    }
}


async function handleLogin(req,res){
    const {email,password} = req.body
    if(!email || !password)
    {
        return res.status(404).json({success:false,msg:"Please provide email and password"})
    }

    const user = await User.findOne({email}).select("+password");
    if(!user)
    {
        return res.status(404).json({success:false,msg:"User not found"});
    }
    const isPasswordCorrect =await user.matchPassword(password);
    if(!isPasswordCorrect)
    {
        return res.status(400).json({success:false,msg:"Email or password is incorrect"});
    }
    user.password = undefined
    const token = generateJwtToken(user)

        const options = {
            expires:new Date(
                Date.now()+ 3*24*60*60*1000
            ),
            httpOnly:true
        }

        return res.status(200).cookie('token',token,options).json({success:true,token,user,msg:"Logged in successfully"});
}

async function handleLogout(req,res)
{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })

    return res.status(200).json({success:true,msg:"Logout success"})
}


async function handleForgetPassword(req,res){
    const {email} = req.body;

    const user =await User.findOne({email});
    if(!user)
    {
        return res.status(404).json({success:false,msg:"User not found"})
    }
    const forgotToken = user.getForgotPasswordToeken();

    await user.save({validateBeforeSave:false});
    const myResetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`
    const options={
        toEmail:email,
        subject:'Forgot password',
        message:`Click on the link to reset your password ${myResetUrl}`
    }

    try {
        await mailHelper(options);
        return res.status(200).json({success:true,msg:"Mail sent successfully"})
    } catch (error) {
        user.forgotPasswordToken=undefined
        user.forgotPasswordExpiry=undefined
        await user.save({validateBeforeSave:false})
        return res.status(400).json({success:false,msg:"some error occured"})
    }
}

async function handleResetPassword(req,res)
{
    const forgotToken = req.params.token;
    
    if(!forgotToken)
    {
        return res.status(400).json({success:false,msg:"No token found"});
    }
    const encryptToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
    
   const user = await User.findOne({forgotPasswordToken:encryptToken,forgotPasswordExpiry:{$gt:Date.now()}})
    console.log(user)
   if(!user)
   {
    return res.status(404).json({success:false,msg:"No user found"})
   }

   if(req.body.password !== req.body.confirmPassword)
   {
    return res.status(400).json({success:false,msg:"Password is different from confirm password"});
   }
   
   user.password = req.body.password;
   user.forgotPasswordExpiry=undefined;
   user.forgotPasswordToken=undefined;
   await user.save();

    user.password = undefined
    const token = generateJwtToken(user)

        const options = {
            expires:new Date(
                Date.now()+ 3*24*60*60*1000
            ),
            httpOnly:true
        }

        return res.status(200).cookie('token',token,options).json({success:true,token,user,msg:"Logged in successfully"});
}

async function handleGetDashboard(req,res)
{
    return res.status(200).json({success:true,user:req.user})
}

async function handleUpdatePassword(req,res)
{
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword)
    {
        return res.status(400).json({success:false,msg:"Please proivde both the entries"})
    }

    const user = await User.findById(req.user._id).select("+password")
    
    if(!user)
    {
        return res.status(404).json({success:false,msg:"No user found"});
    }


    
    if(!user.matchPassword(oldPassword))
    {
        return res.status(400).json({success:false,msg:"Please enter correct old password"});
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({success:true,msg:"Password updated successfully"});
}


//Admin controllers
async function handleAdminAllUsers(req,res)
{
    const users = await User.find();
    
    return res.status(200).json({success:true,users});
}

async function handleAdminOneUser(req,res)
{
    const userId = req.params.id;

    const user = await User.findById(userId);
    if(!user)
    {
        return res.status(400).json({success:false,msg:"No user found"})
    }


    return res.status(200).json({success:true,user})
}

async function handleAdminUpdateOneUser(req,res)
{
    const newData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }


    const user = await User.findByIdAndUpdate(req.params.id,newData,{
        new:true,
        runValidators:true,
    })

    return res.status(200).json({success:true,msg:"User updated successfully"});

}

async function handleAdminDeleteUser(req,res)
{
    const user = await User.findById(req.params.id);

    if(!user)
    {
        return res.status(401).json({success:false,msg:"No user found by that id"})
    }

    const imageId = user.photo.id;

    await cloudinary.v2.uploader.destroy(imageId);
    await user.deleteOne({_id:req.params.id});

    return res.status(200).json({success:true,msg:"User deleted successfully"})
}



//manager controllers
async function handleManagerAllUser(req,res)
{
    const users = await User.find({role:"user"});
    return res.status(200).json({success:true,users})
}






module.exports={
    handleSignup,
    handleLogin,
    handleLogout,
    handleForgetPassword,
    handleResetPassword,
    handleGetDashboard,
    handleUpdatePassword,
    handleAdminAllUsers,
    handleManagerAllUser,
    handleAdminOneUser,
    handleAdminUpdateOneUser,
    handleAdminDeleteUser
}