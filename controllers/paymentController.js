const stripe = require('stripe')(process.env.STRIPE_API_SECRET)
function sendStripeKey()
{
    try {
        res.status(200).json({
            stripekey:proccess.env.STRIPE_API_KEY
        })
    } catch (error) {
        
    }
}


async function handleCaptureStripePayment(req,res)
{
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              unit_amount: req.body.amount,
            },
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:8000/success',
        cancel_url: 'http://localhost:8000/cancel',
      });
    
      res.redirect(session.success_url)
}

async function handleCaptureRazorpayPayment(req,res)
{
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET })

const myOrder = await instance.orders.create({
  amount: req.body.amount,
  currency: "INR",
    
})

return res.status(200).json({success:true,amount:req.body.amount,myOrder})

}

module.exports={
    handleCaptureRazorpayPayment
}