const dbLayer = require('../model/user');
const validate = require("../utilities/validator");
let user = {}

user.setupDB = () => {
   return dbLayer.setupDB().then( response => {  
    if(response){
        return response;
       }else{
           let err = new Error('Insertion Failed');
           err.status = 500;
          throw err;
       } 
   });
}

//Verfying the credentials of user
user.loginUser = (uEmail,pass) => {
    validate.validateemailId(uEmail)
    validate.validatePassword(pass)
    return dbLayer.userLogin(uEmail,pass).then( response => {
        return response
    })
}

//user registration
user.registerUser=(uObj)=>{
    validate.validateemailId(uObj.email)
    validate.validatePassword(uObj.pass)
    validate.validateUsername(uObj.name)
    validate.validatedob(uObj.dob)
    validate.validatemobileNumber(uObj.phone)
    validate.validateaddress(uObj.address)
    return dbLayer.registerUser(uObj).then( response => {
        return response
})
}

// add to user cart
user.addToCart=(user,cart)=>{
    validate.validateemailId(user)
    return dbLayer.addToCart(user,cart).then(response=>{
        return response
    })
}

//fetching products from cart
user.getProductsFromCart=(uEmail)=>{
    validate.validateemailId(uEmail)
    return dbLayer.getProductsFromCart(uEmail).then(response=>{
        return response
    })
}

//deleting product from cart
user.deleteProductFromCart=(uEmail,datatodelete)=>{
    validate.validateemailId(uEmail)
    return dbLayer.deleteProductFromCart(uEmail,datatodelete).then(response=>{
        return response
    })
}

//adding products to purchased items
user.addToMyOrders=(user)=>{
    validate.validateemailId(user)
    return dbLayer.addToMyOrders(user).then(response=>{
        return response
    })
}

// user.addToPurchasedItems=(uEmail,pobj)=>{
//     return dbLayer.addToPurchasedItems(uEmail,pobj).then(response=>{
//         return response
//     })
// }

//fetching products from myorders
user.getPurchasedItems=(uEmail)=>{
    validate.validateemailId(uEmail)
    return dbLayer.getPurchasedItems(uEmail).then(response=>{
        return response})
}

module.exports = user