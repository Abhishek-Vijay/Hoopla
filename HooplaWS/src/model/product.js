const collection = require('../utilities/connection');
const productData = require('./ProductsDatabase.json');
let product = {}

//Setup the database
product.setupDB = () => {
   return collection.getProductCollection().then( prodColl => {
       return prodColl.deleteMany().then( data => {
           if(data){
            return prodColl.insertMany(productData).then( result => {
                if( result && result.length > 0 ) return result.length
                else return null
            });
           }
           
       });
   });
}

// generate product id
product.generateId = () => {
    return collection.getProductCollection().then((model) => {
        return model.distinct("pId").then((ids) => {
            let newArr = []
            // console.log(ids)
            ids.forEach(id=>{
                // let newId = id.slice(1,)
                newArr.push(Number(id))
            })
            // console.log(newArr)
            let sId = Math.max(...newArr);
            let newSid =  sId + 1;
            // console.log(newSid)
            return String(newSid)
        })
    })
}

//psearch by category
product.searchByCategory=(cName)=>{
    return collection.getProductCollection().then(data=>{
        return data.find({pCategory:cName},{_id:0}).then(cdata=>{
            if(cdata.length>0){
                return cdata
            }else {
                return null
            }
        })
    })
}

//psearch on search bar
product.searchByKeyword=(key)=>{
    return collection.getProductCollection().then(data=>{
        return data.find({},{_id:0}).then(cdata=>{
            const pattern = new RegExp(key.toUpperCase())          
            var prodArr = []
            cdata.filter(data=>{
                if(pattern.test(data.pCategory.toUpperCase())){
                    prodArr.push(data)
                }else if(pattern.test(data.pName.toUpperCase())){
                    prodArr.push(data)
                }else if(pattern.test(data.pDescription.toUpperCase())){
                    prodArr.push(data)
                }
            })
            if(prodArr.length>0){
                return prodArr
            }else{
                return null
            }
        })
    })
}


//decrease availability
product.decreaseQuantity=(quantityReq,pObj)=>{
    return collection.getProductCollection().then(prodcoll=>{
        return prodcoll.updateOne({pName:pObj.pName},{$inc:{"pSeller.pQuantity":-quantityReq}},{runValidators:true}).then(cdata=>{
            if(cdata.nModified>0){                
                return true
            }else {
                return false
            }
        })
    })
}

// //increase availability
// product.decreaseQuantity=(quantityProv,pObj)=>{
//     return collection.getProductCollection().then(prodcoll=>{
//         return prodcoll.updateOne({pName:pObj.pName},{$inc:{"pSeller.pQuantity":quantityProv}},{runValidators:true}).then(cdata=>{
//             if(cdata.nModified>0){                
//                 return true
//             }else {
//                 return false
//             }
//         })
//     })
// }

//search product by pid
product.searchByprodId=(pid)=>{
    return collection.getProductCollection().then(data=>{ 
        return data.findOne({pId:pid}).then(pdata=>{
            // console.log(pdata)
            if(pdata){
                return pdata
            }else {
                return null
            }
        })
    })
}


module.exports = product