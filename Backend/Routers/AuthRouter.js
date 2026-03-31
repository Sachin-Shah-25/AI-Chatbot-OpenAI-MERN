import express from 'express'
import {SignUpFun,SignInFun} from '../Conrollers/AuthController.js'
const router=express.Router()



router.post("/signup",(req,res,next)=>{
    console.log("/signup ", req.body)
    next()
},SignUpFun)

router.post("/signin",(req,res,next)=>{
    next()
},SignInFun)

export default router