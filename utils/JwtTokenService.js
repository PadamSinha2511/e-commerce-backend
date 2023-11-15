const jwt = require("jsonwebtoken")
function generateJwtToken(user)
{
    return jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}

function verifyJwtToken(token)
{
    return jwt.verify(token,process.env.JWT_SECRET);
}

module.exports={
    generateJwtToken,
    verifyJwtToken
}