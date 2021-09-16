const express = require("express");
const userRouting = express.Router();
const userService = require('../service/user');
// const productService = require('../service/product');

//Setup the database
userRouting.get("/userDBsetup", (req, res, next) => {
    userService.setupDB().then( response =>{
        if(response) res.json({ message : "Successfully inserted "+ response +" user documents into database"})
    }).catch( error =>{
       next(error);
    })
})

//User LOGIN
userRouting.post('/login', (req,res,next)=>{
    var uEmail= req.body.uEmail;
    var uPass=req.body.uPass;
    return userService.loginUser(uEmail, uPass).then(userData => {
        res.json(userData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    });
});


//registration user
userRouting.post('/register', (req,res,next)=>{
    return userService.registerUser(req.body).then(userData => {
        res.json(userData);
    }).catch(err => {
        // console.log(err.message)
        next(err);
    });
});

// adding to user cart
userRouting.put('/myCart/:uEmail',(req,res,next)=>{
    return userService.addToCart(req.params.uEmail,req.body).then(cartData=>{
        if(cartData){
            res.send("Item added to the cart")
        }
        
    }).catch(err=>{
        // console.log(err.message);
        next(err);
    })
})

//fetching products from cart
userRouting.get('/myCart/:uEmail',(req,res,next)=>{
    return userService.getProductsFromCart(req.params.uEmail).then(prodData=>{
        res.send(prodData)
    }).catch(err=>{
        next(err)
    })
})
    
//deleting product from cart
userRouting.put('/myCart/delete/:uEmail',(req,res,next)=>{
    return userService.deleteProductFromCart(req.params.uEmail,req.body).then(data=>{
        res.send(data)
    }).catch(err=>{
        next(err)
    })
})

//adding products to purchased items
userRouting.put('/checkOut/:uEmail',(req,res,next)=>{
    // console.log("here");
    return userService.addToMyOrders(req.params.uEmail).then(data=>{
        // console.log(data)
        res.send(data)
    }).catch(err=>{
        next(err)
    })
})
// userRouting.post('/checkOut/:uEmail',(req,res,next)=>{
//     return userService.addToPurchasedItems(req.params.uEmail,req.body).then(data=>{
//         res.send(data)
//     }).catch(err=>{
//         next(err)
//     })
//     })

//fetching products from myorders
userRouting.get('/checkOut/:uEmail',(req,res,next)=>{
    return userService.getPurchasedItems(req.params.uEmail).then(data=>{
        res.send(data)
    }).catch(err=>{
        next(err)
    })
})
    
module.exports = userRouting