require('dotenv').config();

const express  = require("express");
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');



//express app
const app = express();


//regular middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//cookie-parser and file upload
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}));

// import all the routes
const homeRoutes  = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");


//router middlewares
app.use("/api/v1",homeRoutes);
app.use("/api/v1",userRoutes);

module.exports=app;