const mongoose = require('mongoose')
const {connect} = mongoose
const ConfigureDB = async ()=>{
    try{
        // const db =  await connect('mongodb://127.0.0.1:27017/blog-app')
        const db = await mongoose.connect('mongodb+srv://rathan:rathan%4007@cluster0.jhevnjk.mongodb.net/blog-app?retryWrites=true&w=majority&appName=Cluster0');
        console.log('connected to db');
    }
    catch(err){
        console.log(err);
    }
}
module.exports = ConfigureDB;