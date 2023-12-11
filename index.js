require('dotenv').config();

const express  = require("express");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs'); 
const swaggerSpec = YAML.load('./swagger.yaml');



//express app
const app = express();


//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

//cookie-parser and file upload
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

app.get("/health",(req,res)=>{console.log('health is fine')})

// import all the routes

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const orderRoutes = require("./routes/orderRoutes")

//router middlewares

app.get("/",(req,res)=>{
    res.status(200).json({success:true,msg:"Hello from server"});
})

app.use("/api/v1",userRoutes);
app.use("/api/v1",productRoutes)
app.use("/api/v1",paymentRoutes)
app.use("/api/v1",orderRoutes)
module.exports=app;