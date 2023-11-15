


function handleHome(req,res){
    res.status(200).json({success:true,msg:"Hello from server"});
}





module.exports = {
    handleHome
}