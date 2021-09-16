const express = require("express");
const prodRouting = express.Router();
// const userService = require('../service/user');
const productService = require('../service/product');


//Setup the database
prodRouting.get("/productDBsetup", (req, res, next) => {
    productService.setupDB().then( response =>{
        if(response) res.json({ message : "Successfully inserted "+ response +" product documents into database"})
    }).catch( error =>{
       next(error);
    })
})

//search by category name
prodRouting.get('/product/:cName', (req,res,next)=>{  
    return productService.searchByCategory(req.params.cName).then(pData => {
        res.json(pData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    })
})

// search on the serach bar
prodRouting.get('/prodSearch/:key', (req,res,next)=>{  
    return productService.searchByKeyword(req.params.key).then(pData => {
        res.json(pData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    })
})

//search product by pid
prodRouting.get('/productId/:pId', (req,res,next)=>{  
    return productService.searchByprodId(req.params.pId).then(pData => {
        res.json(pData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    })
})
module.exports = prodRouting;