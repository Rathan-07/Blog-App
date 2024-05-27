const { title } = require('../../../Job-portal-server/app/validations/job-validationSchema')
const Post = require('../models/post-model')
const { exists } = require('../models/user-model')

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