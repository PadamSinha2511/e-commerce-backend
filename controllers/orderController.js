const Order = require("../models/order")
const Product = require("../models/product")

async function handleCreateOrder(req,res)
{
    const {shippingInfo,orderItem,paymentInfo,taxAmount,shippingAmount,totalAmount} = req.body
    const order = await Order.create({
        shippingInfo,orderItem,paymentInfo,taxAmount,shippingAmount,totalAmount,
        user:req.user._id
    })

    res.status(200).json({success:true,order})

}

async function handleFindOrderById(req,res)
{
    const order = await Order.findById(req.params.id).populate('user','name email').exec();
    if(!order)
    {
        return res.status(400).json({success:false,msg:"No order found"})
    }
    return res.status(200).json({success:true,order})
}

async function handleAllLoggedInOrders(req,res)
{
    const orders = await Order.find({user:req.user._id})
    if(!orders)
    {
        return res.status(400).json({success:false,msg:"No order found"})
    }
    return res.status(200).json({success:true,orders})
}

async function handleAdminAllOrders(req,res)
{
    const orders = await Order.find();
    if(!orders)
    {
        return res.status(400).json({success:false,msg:"No orders found"})
    }
    return res.status(200).json({success:true,orders})
}


async function handleUpdateOrder(req,res)
{
    const order = await Order.findById(req.params.id)

    if(req.body.orderStatus === 'delivered')
    {
        return res.status(400).json({success:false,msg:"Order already marked as delivered"})
    }

    order.orderStatus = req.body.orderStatus;
   
    order.orderItem.forEach(async prod=>{
        await handleStock(prod.product,prod.quantity);
    })

    await order.save();
    return res.status(200).json({success:true,msg:"Order status updated",order})
}


async function handleDeleteOrder(req,res)
{
    await Order.findByIdAndRemove(req.params.id);
    return res.status(200).json({success:true,msg:"Order deleted successfully"})
}



async function handleStock(productId,quantity)
{
    const product = await Product.findById(productId);
    product.stock = product.stock-quantity;
    await product.save({validateBeforeSave:false}) 
}


module.exports={
    handleCreateOrder,
    handleFindOrderById,
    handleAllLoggedInOrders,
    handleAdminAllOrders,
    handleUpdateOrder,
    handleDeleteOrder
}