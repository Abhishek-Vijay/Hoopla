const collection = require('../utilities/connection');
const sellerData = require('./Seller.json');  
const prodModel = require('./product.js');  
let seller = {}

//Setup the database
seller.setupDB = () => {
    return collection.getSellerCollection().then( sellerColl => {
        return sellerColl.deleteMany().then( data => {
            if(data){
                return sellerColl.insertMany(sellerData).then( result => {
                    if( result && result.length > 0 ) return result.length
                    else return null
                });
            }
            
        });
    });
     }


//Seller login
seller.sellerLogin = (sEmail,sPass) => {
    return collection.getSellerCollection().then( sellerColl => {
        return sellerColl.findOne({"sCredentials.sEmail" : sEmail},{_id:0}).then( data => {
            // console.log(data)
            if(data){
                if( sPass == data['sCredentials']['sPass']){
                    return sellerColl.updateOne({"sCredentials.sEmail":sEmail},{$set:{"sProfile.sLastLogin":new Date().toISOString()}}).then( res => {
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


//seller registration
seller.registerSeller=(sellerObj)=>{
    return collection.getSellerCollection().then( sellerColl => {
        return sellerColl.findOne({"sCredentials.sEmail": sellerObj.email},{_id:0}).then(data=>{
            if(data){
                throw new Error("Email Id cannot be used")
            }else{
                // return seller.generateId(sellerObj.subCategory).then(sId=>{
                    let sId = sellerObj.subCategory+"@Seller"
                    // console.log(sellerObj)
                    var obj1 = {"sId":sId,"sCredentials.sEmail": sellerObj.email, "sCredentials.sPass": sellerObj.pass, "sProfile.sName":sellerObj.name,"sProfile.gstNo":sellerObj.gstNo, "sProfile.sPhone":sellerObj.phone, "sProfile.sAddrs":sellerObj.address,"sProfile.sCategory":sellerObj.category,"sProfile.sAccount":sellerObj.account} 
                    return sellerColl.create(obj1).then(result=>{
                        if(result){
                            return "Registration Successfull"
                        }else{
                            throw new Error("Registration Unsuccessfull")
                        }
                    }) 
                // }) 
            }
        })   
    }) 
}
var calculation=(disc,pdata,sEmail,sellerColl)=>{
    return collection.getProductCollection().then(proModel=>{
        return proModel.updateOne({pName:pdata.name},{$set:{price:pdata.price,"pSeller.pDiscount":disc},$inc:{"pSeller.pQuantity":pdata.quantity}},{runValidators:true}).then(data=>{
            if(data.nModified>0){
                return "Your Product Quantity is added to selling items"
            }else{
                var obj1={pName:pdata.name,price:pdata.price,pDescription:pdata.description,"pSeller.pDiscount":disc,"pSeller.pQuantity":pdata.quantity}
                return prodModel.generateId().then(id=>{
                    Object.assign(obj1, {pId: id});
                    return sellerColl.findOne({"sCredentials.sEmail": sEmail},{_id:0}).then(data=>{
                        Object.assign(obj1, {pCategory: data.sProfile.sCategory,"pSeller.sId":data.sId});
                        return proModel.create(obj1).then(result=>{
                            if(result){
                                return "Product is Added Successfully"
                            }else{
                                throw new Error("Your Product can't be added")
                            }
                        })
                    })
                })                     
            }
        })
    })
}

// adding products to seller
seller.addProducts=(sEmail,pdata)=>{
    return collection.getSellerCollection().then( sellerColl => {
            var pObj={"pName":pdata.name,"price":pdata.price,"quantity":pdata.quantity,"discount":pdata.discount}
            // console.log(pObj)
            return sellerColl.findOne({"sCredentials.sEmail":sEmail},{_id:0}).then(sellerdata=>{
                var newArr = []
                sellerdata.sProfile.sProducts.forEach(Obj=>{
                    if(Obj.pName === pdata.name){
                        newArr.push(Obj)
                    }
                })
            if(newArr.length===0){
            return sellerColl.updateOne({"sCredentials.sEmail": sEmail},{$push:{"sProfile.sProducts":pObj}},{runValidators:true}).then(model=>{
                if(model.nModified>0){
                    let disc = pdata.discount/100 ;
                   return calculation(disc,pdata,sEmail,sellerColl)
                }else{
                    throw new Error("Product Addition Failed")
                }
            })
        }else{
            return sellerColl.updateOne({"sCredentials.sEmail": sEmail, "sProfile.sProducts.pName":newArr[0].pName},{$set:{"sProfile.sProducts.$.quantity":pdata.quantity}},{runValidators:true}).then(model=>{
                if(model.nModified>0){
                    let disc = pdata.discount/100 ;
                   return calculation(disc,pdata,sEmail,sellerColl)
                }else{
                    throw new Error("Product Addition Failed")
                }
            })
        }
    })
    })
}

//fetch products of particular seller
seller.getProducts=(sEmail)=>{
    return collection.getSellerCollection().then( sellerColl => {
        return sellerColl.findOne({"sCredentials.sEmail": sEmail},{_id:0}).then(data=>{
                return data.sProfile.sProducts
        })
    })
}

module.exports=seller