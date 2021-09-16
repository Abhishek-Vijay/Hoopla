const collection = require('../utilities/connection');
const userData = require('./User.json');
const prodModel = require('./product.js');
let user = {}

//Setup the database
user.setupDB = () => {
    return collection.getUserCollection().then( userColl => {
        return userColl.deleteMany().then( data => { 
            if(data){
                return userColl.insertMany(userData).then( result => {
                    if( result && result.length > 0 ) return result.length
                    else return null
                });
            }           
            
        });
    });
     }

user.generateId = () => {
    return collection.getUserCollection().then((model) => {
        return model.distinct("userId").then((ids) => {
            let newArr = []
            ids.forEach(id=>{
                let newId = id.substr(1)
                newArr.push(Number(newId))
            })
            // console.log(newArr)
            let sId = Math.max(...newArr);
            let newSid =  sId + 1;
            // console.log(newSid)
            return "U"+newSid
        })
    })
}

//Verify the user credentials and modify the last logout
user.userLogin = (uEmail,uPass) => {
    return collection.getUserCollection().then( userColl => {
        return userColl.findOne({"uCredentials.uEmail" : uEmail},{_id:0}).then( data => {
            if(data){
                if( uPass == data['uCredentials']['uPass']){
                    return userColl.updateOne({"uCredentials.uEmail":uEmail},{$set:{"uProfile.uLastLogin":new Date().toISOString()}}).then( res => {
                        if(res.nModified){
                            return data
                        }})
                }else{
                    throw new Error("The Email or Password entered is incorrect!!")
                }
            }else{
                throw new Error("You are not registered.Please register to login"); 
            }
        })})
}


//adding user to db
user.registerUser=(userObj)=>{
    return collection.getUserCollection().then( userColl => {
        return userColl.findOne({"uCredentials.uEmail": userObj.email},{_id:0}).then(data=>{
            if(data){
                throw new Error("Email Id cannot be used")
            }else{
                return user.generateId().then(userId=>{
                   var obj1 = {"userId":userId,"uCredentials.uEmail": userObj.email, "uCredentials.uPass": userObj.pass, "uProfile.uName":userObj.name, "uProfile.uDOB":userObj.dob, "uProfile.uPhone":userObj.phone, "uProfile.uAddrs":userObj.address} 
                    return userColl.create(obj1).then(result=>{
                        if(result){
                            return "Registration Successfull"
                        }else{
                            throw new Error("Registration Unsuccessfull")
                        }
                    }) 
                }) 
            }
        })   
    }) 
}

// add to user cart 
user.addToCart=(user,myCart)=>{
    return collection.getUserCollection().then( usercoll=>{
        return usercoll.findOne({"uCredentials.uEmail":user},{_id:0}).then(userdata=>{
           var newArr = []
            userdata.cart.forEach(pObj=>{
                if(pObj.products.pId === myCart.products.pId){
                    newArr.push(pObj)
                }
            })
            if(newArr.length===0){
                return usercoll.updateOne({"uCredentials.uEmail":user},{$push:{cart:myCart}},{runValidators:true}).then(data=>{
                    if(data.nModified>0){
                        return "Product added to cart successfully"
                    }else{
                        throw new Error("Cart addition Failed")
                    }
                })
            }else{
                // console.log(newArr[0].products.pId)
                return usercoll.updateOne({"uCredentials.uEmail":user, "cart.products.pId":newArr[0].products.pId},{"cart.$.quantity":myCart.quantity},{runValidators:true}).then(data=>{
                    if(data.nModified>0){
                        return "Product quantity updated to cart successfully"
                    }else{
                        throw new Error("Error while updating cart data")
                    }
                });
            }
        })
    })
}

//fetching products from cart
user.getProductsFromCart=(uEmail)=>{
    return collection.getUserCollection().then(userColl=>{
        return userColl.findOne({"uCredentials.uEmail":uEmail},{_id:0}).then(data=>{     
                return data.cart
                
        })
    })
}


//deleting product from cart
user.deleteProductFromCart=(uEmail,datatodelete)=>{
    return collection.getUserCollection().then(userColl=>{
        return userColl.findOne({"uCredentials.uEmail":uEmail},{_id:0}).then(udata=>{
            var cart1=[]  
            if(udata.cart.length>0){            
                (udata.cart).forEach(data=>{
                if(data.products.pName!=datatodelete.products.pName){
                        cart1.push(data)
                        // console.log(cart1)
                }
            })
                return userColl.updateOne({"uCredentials.uEmail":uEmail},{$set:{cart:cart1}}).then(udata=>{
                    if(udata.nModified>0){  
                        return cart1
                    }
                })
            }
        })
    })
}

//adding products to purchased items
user.addToMyOrders=(user)=>{
return collection.getUserCollection().then(userColl=>{
    return userColl.findOne({"uCredentials.uEmail":user},{_id:0}).then(uData=>{
        var userCart = uData.cart
        var myorder = [];
        userCart.map(cartObj=>{
            return prodModel.decreaseQuantity(cartObj.quantity,cartObj.products).then(data=>{
                if(data==true){
                    myorder.push(cartObj);
                    
                }
            })
        })
        return userColl.updateOne({"uCredentials.uEmail":user},{$push:{myOrders:{$each:userCart}},$set:{cart:[]}},{runValidators:true}).then(data=>{
            if(data.nModified>0){
                return "CheckOut Done"
            }else{
                throw new Error("Opration Failed")
            }
        })
    })
})
}

//fetch products from myOrders
user.getPurchasedItems=(uEmail)=>{
    return collection.getUserCollection().then(userColl=>{
        return userColl.findOne({"uCredentials.uEmail":uEmail},{_id:0}).then(data=>{     
                return data.myOrders
                
        })
    })
}
module.exports = user