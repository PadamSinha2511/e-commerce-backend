const mongoose = require("mongoose");


async function connectToDb()
{
    try {
      const conn =  mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
            useUnifiedTopology:true,
      })
      console.log("Connected to Db")  
    } catch (error) {
        console.log("Error connecting to db",error)
    }
}

module.exports={
    connectToDb
}