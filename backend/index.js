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
const Book=require("./routes/book");
const Favourite=require("./routes/favourite");
const Cart=require("./routes/cart");
const Order=require("./routes/order");

//using routes
app.use("/api/v1",User);
app.use("/api/v1",Book);
app.use("/api/v1",Favourite);
app.use("/api/v1",Cart);
app.use("/api/v1",Order);


app.get("/",(req,res)=>{
    res.send("Hello from backend Side")
})
app.listen(process.env.port  ,(req,res)=>{
    console.log(`server is running at port ${process.env.port}`);
    
})