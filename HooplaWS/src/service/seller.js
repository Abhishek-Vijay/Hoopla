const dbLayer = require('../model/seller');
let seller = {}

seller.setupDB = () => {
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
seller.sellerLogin = (sEmail,sPass) => {
    return dbLayer.sellerLogin(sEmail,sPass).then( response => {
        return response
    })
}

//seller registration
seller.registerSeller=(sObj)=>{
    return dbLayer.registerSeller(sObj).then( response => {
        return response
})
}

//add products to seller
seller.addProducts=(sEmail,pdata)=>{
    return dbLayer.addProducts(sEmail,pdata).then( response => {
        return response
})
}

//fetch products of particular seller
seller.getProducts=(sEmail)=>{
    return dbLayer.getProducts(sEmail).then( response => {
        return response
})
}
module.exports=seller