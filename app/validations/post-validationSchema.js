



const postValidationSchema = {
    title:{
        in:['body'],
        exists:{
            errorMessage:"title is required"
        },
        notEmpty:{
            errorMessage:"title field cannot be empty"
        },trim:true

    },
    content:{
        in:['body'],
        exists:{
            errorMessage:"content is required"
        },
        notEmpty:{
            errorMessage:"content field cannot be empty"
        },trim:true

    }
}