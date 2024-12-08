const router=require("express").Router();
const User=require("../models/user")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const {authenticateToken}=require("./userAuth")

//sign-up
router.post("/sign-up",async(req,res)=>{
    try{
        //take details from the req.body
        const {username,email,password,address,role}=req.body;
        
        //check username length is more than 3;
        if(username.length<4){
            return res
                .status(400)
                .json({message:"Username length should be greater than 3"});
        }

        //check is the username already exists

        const existingUsername=await User.findOne({username:username});
        if(existingUsername){
            return res.status(400)
                      .json({message:"Username already exists"})
        }


        //check is the email already exists

        const existingEmail=await User.findOne({email:email});
        if(existingEmail){
            return res.status(400)
                      .json({message:"Email already exists"})
        }

        //password length >4

        if(password.length<=4){
            return res.status(400)
                      .json({message:"Password length should be greater than 4"}) 
        }
        

        const hassPass=await bcrypt.hash(password,10)

        const newUser =new User ({
            username:username,
            email:email,
            password:hassPass,
            address:address,
            role:role
        })
        await newUser.save();
        return res.status(200).json({message:"SignUp Successfully"})

    }catch(error){
        console.log(error)
    }
})


//sign-in
router.post("/sign-in",async(req,res)=>{
    try{
        const {username,password}=req.body;

        const existingUser=await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"Invalid credentials"});
        }

        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims=[
                    {name: existingUser.username},
                    {role:existingUser.role},
                ];

                const token=jwt.sign({authClaims},"bookStore123",{
                    expiresIn:"30d",
                });
                res.status(200).json({
                    id:existingUser._id,
                    role:existingUser.role,
                    token:token,
                });
            }
            else{
                res.status(400).json({message:"Invalid credentials"});
            }
        });

    }catch{
        res.status(500).json({message:"Internal server error"})

    }
});


//get-user-information
router.get("/get-user-info",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const data=await User.findById(id).select("-password");
        return res.status(200).json(data);

    }
    catch(error){
        console.log(error)
    }
})

// update address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const {address}=req.body;
        await User.findByIdAndUpdate(id ,{address:address});
        return res.status(200).json({message:"Address updated successfully"});

    }catch(error){
        res.status(500).json({message: "Internal server error"});
    }
})

module.exports=router;