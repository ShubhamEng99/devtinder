const validator = require('validator')
const validateSignUpData = (req) =>{
    const {firstName,lastName,emailId,password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not strong");
    }
}

const validateEditProfileData = (req) =>{
    const Allowed_Updates = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(req.body).every((k) =>
      Allowed_Updates.includes(k)
    );
    return isUpdateAllowed
}

module.exports ={
    validateSignUpData,
    validateEditProfileData
}