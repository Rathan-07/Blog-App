const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Post Schema
const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    featuredImage: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Post Model
const Post = model('Post', postSchema);
module.exports = Post;
