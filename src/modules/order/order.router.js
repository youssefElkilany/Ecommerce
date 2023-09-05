import express,{ Router } from "express";
import * as orderController from './controller/Order.js'
import auth from "../../middleware/auth.js";
import { roles } from "../../middleware/validation.js";
const router = Router()



router.route('/')
.get((req ,res)=>{
    res.status(200).json({message:"order Module"})
})
.post(auth(roles.user),orderController.addOrder)
 
router.post('/webhook', express.raw({type: 'application/json'}),orderController.webhook) 
export default router