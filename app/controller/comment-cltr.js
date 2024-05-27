const Comment = require('../models/comment-model');
const Post = require('../models/post-model');
const { validationResult } = require('express-validator');
const _ = require('lodash');

const commentCltr = {};

commentCltr.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const postId = req.params.postId; 
        const body = _.pick(req.body, ['content']);
        const comment = new Comment(body);
        comment.author = req.user.id;
        comment.post = postId;

        await comment.save();

        
        const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } }, { new: true });

       
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(comment);
    } catch (error) {
        console.error(error); // 
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// commentCltr.get = async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const post = await Post.findById(postId).populate('comments');

//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         res.json(post.comments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };
// commentCltr.single = async (req, res) => {
//     try {
//         const { postId, commentId } = req.params;
      
//         // Find the post belonging to the authenticated user
//         // const post = await Post.findById(postId);
//         // if (!post) {
//         //     return res.status(404).json({ error: 'Post not found' });
//         // }

//         // Find the comment associated with the post
//         const comment = await Comment.find({ _id: commentId, post: postId}).populate('author')
//         if (!comment) {
//             return res.status(404).json({ error: 'Comment not found' });
//         }

//         // Respond with the comment data
//         res.json(comment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Something went wrong' });
//     }
// };


commentCltr.get = async (req, res) => {
    try {
        const postId = req.params.postId;
        // const post = await Post.findById(postId)
        const post = await Post.findById(postId).populate({
            path: 'comments',
            populate: { path: 'author', select: 'username' }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


commentCltr.single = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        // const comment = await Comment.findOne({ _id: commentId, post: postId })
        const comment = await Comment.findOne({ _id: commentId, post: postId }).populate('author', 'username');
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};




commentCltr.update = async(req,res)=>{
 try{
    const commentId = req.params.commentId
    const body = req.body
   
    const comment  = await Comment.findOneAndUpdate({_id:commentId,author:req.user.id},body,{new:true})
    if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment)
 }
 catch(error){
    res.status(500).json({ error: 'Something went wrong' });
 }
}
commentCltr.remove = async (req, res) => {  
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;
       
        const comment = await Comment.findById(commentId);
        const post = await Post.findById(postId);
    
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.author.toString() === req.user.id || post.author.toString() === req.user.id) {
            const deletedComment = await Comment.findByIdAndDelete(commentId);
            if (!deletedComment) {
                return res.status(404).json({ error: 'Comment not found' });
            }
            await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });
            return res.json({ message: 'Comment deleted successfully', deletedComment });
        } else {
            return res.status(403).json({ error: 'Unauthorized to delete this comment' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};



module.exports = commentCltr;
