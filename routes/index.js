const express= require('express');
const isLoggedin = require('../middleware/isLoggedin');
const productmodel = require('../models/product-model');
const userModel = require('../models/user-model');
const router= express.Router();

router.get('/',(req,res)=>{
    let error= req.flash("error");
    res.render("index",{ error , loggedin : false});                             
})

router.get('/shop', isLoggedin, async(req,res)=>{
    let products= await productmodel.find();
    let success= req.flash('success')
    res.render('shop',{products, success});
    
})

router.get('/addtocart/:productid', isLoggedin, async function(req,res){
    let user=await userModel.findOne({email: req.user.email})
    user.cart.push(req.params.productid)
    await user.save();
    req.flash("success","added to cart");
    res.redirect('/shop');
})

router.get('/cart', isLoggedin, async(req,res)=>{
    let user= await userModel.findOne({email: req.user.email}).populate("cart");
     
    function calculateTotalSum(user) {
        return user.cart.reduce((total, item) => total + (item.price - item.discount), 0);
      }
    
    const bill = calculateTotalSum(user);
    
    res.render('cart',{ user, bill});
    
})

router.get('/logout', isLoggedin, function(req,res){
    res.render("shop")
})

module.exports=router;