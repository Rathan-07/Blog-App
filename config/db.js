const mongoose = require('mongoose')
const {connect} = mongoose
const ConfigureDB = async ()=>{
    try{
        const db =  await connect('mongodb://127.0.0.1:27017/blog-app')
        console.log('connected to db');
    }
    catch(err){
        console.log(err);
    }
}
module.exports = ConfigureDB;