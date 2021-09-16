const dbLayer = require('../model/product');


let product = {}

product.setupDB = () => {
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

product.searchByCategory=(cName)=>{
    return dbLayer.searchByCategory(cName).then( response => {
        if(response!=null){
            return response
        }else{
            throw new Error("There is no Product for this category")
        }
})
}

product.searchByKeyword=(key)=>{
    return dbLayer.searchByKeyword(key).then(response => {
        if(response!=null){
            return response
        }else{
            throw new Error("No item found")
        }
})
}

//search product by pid
product.searchByprodId=(pid)=>{
    return dbLayer.searchByprodId(pid).then(response => {
        if(response!=null){
            return response
        }else{
            throw new Error("No item found")
        }
})
}

module.exports = product