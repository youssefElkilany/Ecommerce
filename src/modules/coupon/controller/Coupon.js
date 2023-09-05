import couponModel from "../../../../DB/model/Coupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const addCoupon = asyncHandler(async(req,res,next)=>{
    const {code,expireDate,amount} = req.body

    const checkCode = await couponModel.findOne({code})
    if(checkCode)
    {
        return next(new Error("code already exist"))
    }
    if(expireDate<Date.now())
    {
        return next(new Error("enter appropriate time"))
    }

    const Coupon = await couponModel.create({code,amount,expireDate,createdBy:req.user._id})

    return res.json({message:"done",Coupon})
})

