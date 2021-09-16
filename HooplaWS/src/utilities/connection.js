const { Schema } = require('mongoose');
const Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
Mongoose.set('useCreateIndex', true)
const url = "mongodb://localhost:27017/Hoopla_DB"

const productsSchema = Schema({
    pId : {type : String, required: [true, 'pId is required'], unique : [true, 'pId should be unique']},
    pName : {type : String, required: [true, 'pName is required']},
    pDescription : {type : String, required: [true, 'pDescription is required']},
    pRating : {type : Number },
    pCategory : {type : String, required: [true, 'pCategory is required']},
    price : { type : Number, required: [true, 'price is required']},
    color : { type : String},
    image : { type : String},
    specification : {type : String},
    pSeller:{
        sId: {type: String, required :true},
        pDiscount : {type: Number},
        pQuantity : { type: Number, required: true},
        pShippingCharges : { type : Number, default:100}
    }
}, { collection: "Products", timestamps: true })

const userTransactionSchema = Schema({
    products : { type:{productsSchema}, default:{}},
    quantity : {type: Number, required:true, default:1},
}, { collection: "Transactions", timestamps: true })

const usersSchema = Schema({
    userId : {type : String, required : [true, 'userId is required']},
    uCredentials : {
        uEmail : {type : String, required : [true, 'uMail is required']},
        uPass  : {type : String, required : [true, 'uPass is required']}
    },
    uProfile : {
        uName : {type : String, required : [true, 'uName is required']},
        uDOB : {type : Date, required : [true, 'uDOB is required']},
        uPhone : {type : Number, required : [true, 'uPhone is required']},
        uAddrs : { type: String, required : [true , 'uAddrs is required']},
        uDateJoined : {type : Date, default : new Date().toISOString()},
        uLastLogin : {type : Date, default : new Date().toISOString()}
    },
    cart : { type: [userTransactionSchema], default : [] },
    myOrders : { type: [userTransactionSchema], default : [] }
}, {collection : "Users", timestamps: true })


const sellersSchema = Schema({
    sId: {type: String, required :true},
    sCredentials : {
        sEmail : {type : String, required : [true, 'sMail is required']},
        sPass  : {type : String, required : [true, 'sPass is required']}
    },
    sProfile : {
        sName: { type: String, required:true},
        gstNo: { type: String, required:true},
        sPhone: { type: Number, required:true},
        sAddrs: { type: String},
        sAccount: {type:Number, required:true},
        sCategory: {type:String,required:true},
        sDateJoined : {type : Date, default : new Date().toISOString()},
        sLastLogin : {type : Date, default : new Date().toISOString()},
        sProducts:{type:[{pName:{type:String, required:true},
            price:{type:Number, required:true},
            quantity:{type:Number, required:true},
            discount:{type:Number, default:0}}],default:[]}
    }
},{collection : "Sellers", timestamps: true })

let connection = {}

//Returns model object of "Users" collection
connection.getUserCollection = () => {
    //establish connection and return model as promise
    return Mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then( database => {
        return database.model('Users', usersSchema)
    }).catch( error => {
        if(error){
            let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
        }
    });
}

connection.getProductCollection = () => {
    //establish connection and return model as promise
    return Mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then( database => {
        return database.model('Products', productsSchema)
    }).catch( error => {
        if(error){
            let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
        }
    });
}


connection.getSellerCollection = () => {
    //establish connection and return model as promise
    return Mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then( database => {
        return database.model('Sellers', sellersSchema)
    }).catch( error => {
        if(error){
            let err = new Error("Could not connect to the database");
        err.status = 500;
        throw err;
        }
    });
}

module.exports = connection;