const User = require("../models/user")
const { verifyJwtToken } = require("../utils/JwtTokenService");

async function isLoggedIn(req,res,next)
{
    const token = req.cookies.token;
    
    if(!token)
    {
        return res.status(300).json({success:false,msg:"Log in to access this page"});
    }

    const decoded = verifyJwtToken(token);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
}

function customRoles(...roles)
{
    return async(req,res,next)=>{
        const user=await User.findById(req.user._id);
        if(!roles.includes(req.user.role))
        {
            return res.status(400).json({success:false,msg:`Permission required`})
            
        }
        next();
    }
}

module.exports={
    isLoggedIn,
    customRoles
}