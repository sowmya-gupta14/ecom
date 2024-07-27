const express= require('express');
const router= express.Router();
const ownermodel= require('../models/owner-model');

if(process.env.NODE_ENV==="development"){
    router.post('/create', async function(req,res){
        let owners=await ownermodel.find();
        if(owners.length>0){
            return res
              .status(503)
              .send("you dont have permissions")

        } 
        let {fullname, email, password} = req.body;

        let createdowner=await ownermodel.create({
            fullname,
            password,
            email,
        })

        res.send(createdowner)

    })
}

router.get('/admin', function(req,res){
    let success= req.flash("success")
    res.render("createProducts",{success});
})





module.exports= router;