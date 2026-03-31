import mongoose from 'mongoose'


const authSchema=new mongoose.Schema({
    username:{
        type:String
    },
    useremail:{
        type:String
    },
    userpassword:{
        type:String
    },
    useremail:{
        type:String
    },
    userimage:{
        type:String,
    }
},{timestamps:true})


const authenticationModel=mongoose.model("authuser",authSchema);

export default authenticationModel