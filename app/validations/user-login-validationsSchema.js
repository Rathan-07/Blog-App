
const userloginValidationSchmea = {
    email:{
        exists:{
            errorMessage:"email field is required"
        },
        notEmpty:{
            errorMessage:"email cannot be empty"
        },
        isEmail:{
            errorMessage:"invalid email format"
        },
        normalizeEmail: true,
        trim:true
    },
    password:{
        exists:{
            errorMessage:"password field is required"
        },
        notEmpty:{
            errorMessage:"password cannot be empty"
        },
        isLength:{
            options:{min : 8,max:128},
            errorMessage:"password should be between 8-128 characters"

        },trim:true,


    }
}
module.exports = userloginValidationSchmea