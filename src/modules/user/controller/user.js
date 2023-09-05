//import userModel from "../../../../DB/model/User.model.js";

import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const getallusers = asyncHandler(async(req,res,next)=>{

    const users = await userModel.find()
    return res.json({users})
})