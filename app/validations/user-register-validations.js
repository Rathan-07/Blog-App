const User = require("../models/user-model")

const UserRegisterValidations = {
    username:{
        in:['body'],
        exists:{
        
            errorMessage:"username field is required"
        },
        notEmpty:{
            errorMessage:" username field cannot be empty"
        },trim:true
    },
    email:{
        in:['body'],
        exists:{
        
            errorMessage:"Email field is required"
        },
        notEmpty:{
            errorMessage:"Email field cannot be empty"
        },
        isEmail:{
            errorMessage:"Email should be in valid format"
        },trim:true,
        custom:{
            options: async function(value){ 
             const user = await User.findOne({email:value})
             if(user){
                throw new Error("email is already exists") 
             }
             return true
            },
            normalizeEmail:true
        }
       

    },
    password:{

        in:['body'],
        exists:{
        
            errorMessage:"password field is required"
        },
        notEmpty:{
            errorMessage:"password field cannot be empty"
        },trim:true,

        isLength:{
           options:{min:5,max:128},
           errorMessage:"password should be between 8 -128 characters"
        },
    },
       
 
}
module.exports = UserRegisterValidations;