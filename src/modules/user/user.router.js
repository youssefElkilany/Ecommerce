import { Router } from "express";
import * as usercontroller from './controller/user.js'
import userModel from "../../../DB/model/User.model.js";
const router = Router()


router.get("/",async(req,res,next)=>{
    const {qwe}= req.body

    const us = await userModel.updateOne({},{})
})

router.get('/', usercontroller.getallusers)

//router.get()



export default router