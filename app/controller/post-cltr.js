const Post = require('../models/post-model')
const { validationResult } = require('express-validator')

const postCltr = {}

postCltr.create = async(req,res)=>{
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
          const body = req.body
          const post = new Post(body)
          post.author = req.user.id
          await post.save()
          res.json(post)
    }
    catch(error){
        res.status(500).json({ error: 'something went wrong'})
    }
}
postCltr.get = async(req,res)=>{
    try{
        const post = await Post.find()
        res.json(post)
    }
    catch(error){
        res.status(500).json({ error: 'something went wrong'})
    }
}
postCltr.singlePost = async(req,res)=>{
   
    try{
        const id = req.params.id
        const post = await Post.findById(id)
        if(!post){
            return res.status(404).json({error:"post not found"})
        }
        res.json(post)

        
    }
    catch(error){
        res.status(500).json({ error: 'something went wrong'})
    }
}
postCltr.update = async(req,res)=>{
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
       const id = req.params.id
       const body = req.body
       const post = await Post.findOneAndUpdate({author:req.user.id, _id:id},body,{new:true})
       if(!post) {
        return res.status(404).json({ error: 'record not found'})
    }
    res.json(post)
  }
  catch(error){
      res.status(500).json({ error: 'something went wrong'})
  }
}
postCltr.remove = async(req,res)=>{
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    try{
         const id = req.params.id
         const post = await Post.findOneAndDelete({author:req.user.id, _id:id})
         if(!post) {
            return res.status(404).json({ error: 'record not found'})
        }
        res.json(post)
    }
    catch(error){
        res.status(500).json({ error: 'something went wrong'})
    }
}
postCltr.myposts = async (req, res) => {
   
    try { 
        const posts = await Post.find({author: req.user.id})
       res.json(posts) 
    } catch(err) {
        // console.log("my-error",err) 
        res.status(500).json({ error: 'something went wrong in my'})
    }
}
module.exports = postCltr