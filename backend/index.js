const express=require('express');
const app=express();

require("dotenv").config();
require("./conn/conn")

app.listen(process.env.port  ,(req,res)=>{
    console.log(`server is running at port ${process.env.port}`);
    
})