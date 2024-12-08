const router=require("express").Router();
const{authenticateToken}=require("./userAuth");
const User=require("../models/user");


//add the book to the cart

router.put("/add-book-to-cart",authenticateToken,async(req,res)=>{
    try{
        const {bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isBookInCart=userData.cart.includes(bookid);
        if(isBookInCart){
            return res.status(200).json({message:"Book is already in cart"});
        }
        await User.findByIdAndUpdate(id,{$push:{cart:bookid}});
        return res.status(200).json({message:"Book is added to cart"});

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

//remove the book from the cart

router.put("/remove-book-from-cart/:bookid",authenticateToken,async(req,res)=>{
    try{
        const {bookid,id}=req.headers;
        const userData=await User.findById(id);
        const isBookInCart=userData.cart.includes(bookid);
        if(isBookInCart){
            await User.findByIdAndUpdate(id,{$pull:{cart:bookid}});
        }
        
        return res.status(200).json({message:"Book is removed from cart"});

    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})
//get cart of a particular user
router.get("/get-user-cart",authenticateToken,async(req,res)=>{
    try{
        const {id}=req.headers;
        const userData=await User.findById(id).populate("cart");
        
        const cart=userData.cart.reverse();
        return res.json({
            status:"Success",
            data:userData
        });
       
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

module.exports=router;