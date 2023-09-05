import { Router } from "express";
import * as couponController from './controller/Coupon.js'
import * as val from "./coupon.validation.js"
import auth from "../../middleware/auth.js";
import { roles, validation } from "../../middleware/validation.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Coupon Module"})
})
router.post('/',auth([roles.user]),couponController.addCoupon)  //elmfrood roles => admin





export default router