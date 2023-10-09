//import userModel from "../../../../DB/model/User.model.js";

import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const getallusers = asyncHandler(async(req,res,next)=>{

    const users = await userModel.find()
    return res.json({users})
})


export const deleteUser = asyncHandler(async(req,res,next)=>{

    const {userId} = req.params

    const user = await userModel.findByIdAndDelete(userId)
    if(!user.$isDeleted)
    {
        return next(new Error("not deleted"))
    }
    return res.json("user deleted")
})