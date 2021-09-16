let Validator = {};

Validator.validateemailId = function (emailId) {
    let pattern = new RegExp("^[A-z][A-z0-9.]+@[a-z]+.[a-z]{2,3}$");
    if (!pattern.test(emailId)) {
        let err = new Error("Email id format is wrong");
        err.status = 406
        throw err;
    }
    
}



Validator.validatePassword = function (password) {
    let pattern=new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$")
    if (!pattern.test(password)) {
        let err = new Error("Should be 7-20 characters long consisiting of alphabets with at least 1 uppercase , 1 lowercase,1 digits and any of !@#$%&");
        err.status = 406;
        throw err;
    }
   
}

Validator.validateUsername=function(username){
   
    let uRegex=new RegExp("^[^ ][a-zA-Z ]{1,}[a-zA-Z]$")
    if (!uRegex.test(username)) {
        let err = new Error("Should be at least 3 characters long consisting of alphabet and spaces and spaces should not be present at start or end");
        err.status = 406;
        throw err;
    }
    
}
Validator.validatemobileNumber=function(mobileNumber){
    let nRegex = new RegExp("^[1-9]{1}[0-9]{9}$")
    if (!nRegex.test(mobileNumber)) {
        let err = new Error("Mobile number should be of 10 digits");
        err.status = 406;
        throw err;
    }
   
}
Validator.validatedob=function(dob){
    var todayDate = new Date()
    var dobDate = new Date(dob)
    if (!(dobDate <= todayDate)){
        let err = new Error("User DOB should be less than today's date");
        err.status = 406;
        throw err;
    }
    
}

Validator.validateaddress=function(address){
    let addRegex = new RegExp(".{10,}");
    if (!addRegex.test(address)){
        let err = new Error("Provide proper address of at least 10 characters");
        err.status = 406;
        throw err;
    }
    
}
module.exports = Validator