const app = require('./index');
const { connectToDb } = require('./config/db');
const cloudinary = require('cloudinary');
connectToDb();


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_SECRET,
    secure:true
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`)
})

