const usermodel = require('../models/user-model');
const bcrypt= require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser= require('cookie-parser');
const {generateToken}= require('../utils/generateToken');

module.exports.registerUser= async function(req,res){
    try{
        let { email, fullname, password } = req.body;

        let user= await usermodel.findOne({email:email})
        if(user) {
            req.flash("error","You already have an account pls login")
            return res.redirect('/')
        }
        
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(password, salt, async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user = await usermodel.create({
                        email,
                        fullname,
                        password: hash,
                    })

                    let token= generateToken(user);
                    res.cookie("token",token);
                    
                    res.send("user created successfully");

                }
            })
        })   
    }
    catch(err){
        console.log(err.message);
    }


}

module.exports.loginUser= async function(req,res){
    let {email,password}= req.body;
    let user= await usermodel.findOne({email:email});
    if(!user) {
        req.flash("error","something went wrong")
        return res.redirect('/');
    }

    bcrypt.compare(password, user.password, (err,result)=>{
        if(result){
            let token=generateToken(user);
            res.cookie("token",token);
            res.redirect('/shop')
        }
        else{
            req.flash("error","something went wrong");
            return res.redirect("/");

        }
    })
}

module.exports.logout= async function(req,res){
    res.cookie("token","");
    res.redirect('/');
}