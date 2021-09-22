const express = require("express");
const sellerRouting = express.Router();

const sellerService = require('../service/seller');


//setting seller db
sellerRouting.get("/sellerDBsetup", (req, res, next) => {
    sellerService.setupDB().then( response =>{
        if(response) res.json({ message : "Successfully inserted "+ response +" user documents into database"})
    }).catch( error =>{
       next(error);
    })
})

//Seller LOGIN
sellerRouting.post('/sellerLogin', (req,res,next)=>{
    // console.log("fsd")
    var sEmail= req.body.sEmail;
    var sPass=req.body.sPass;
    // console.log(sEmail)
    // console.log(sPass)
    return sellerService.sellerLogin(sEmail, sPass).then(sellerData => {
        res.json(sellerData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    });
});

//seller registration
sellerRouting.post('/register', (req,res,next)=>{
    return sellerService.registerSeller(req.body).then(sellerData => {
        res.json(sellerData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    });
});

//add products to seller
sellerRouting.put('/products/:sEmail',(req,res,next)=>{
    return sellerService.addProducts(req.params.sEmail,req.body).then(data=>{
        res.json(data)
    }).catch(err => {
        // console.log(err.message)
        next(err);
    })
})

//fetch products of particular seller
sellerRouting.get('/products/:sEmail',(req,res,next)=>{
    return sellerService.getProducts(req.params.sEmail).then(prodData=>{
        res.send(prodData)
    }).catch(err=>{
        next(err)
    })
})

module.exports = sellerRouting