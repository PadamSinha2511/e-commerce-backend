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

// import all the routes
const homeRoutes  = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")

//router middlewares
app.use("/api/v1",homeRoutes);
app.use("/api/v1",userRoutes);
app.use("/api/v1",productRoutes)
module.exports=app;