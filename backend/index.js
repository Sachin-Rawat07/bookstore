const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))

require("dotenv").config();
require("./conn/conn")

// calling routes

const User= require("./routes/user");

//using routes
app.use("/api/v1",User);


app.get("/",(req,res)=>{
    res.send("Hello from backend Side")
})
app.listen(process.env.port  ,(req,res)=>{
    console.log(`server is running at port ${process.env.port}`);
    
})