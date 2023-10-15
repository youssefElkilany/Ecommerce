//import userModel from "../../../../DB/model/User.model.js";
import productModel from "../../../../DB/model/Product.model.js"
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



export const addToFavourites = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params

    const fav = await productModel.findOneAndUpdate({favourites:productId},{
        $addToSet:{
            favourites:productId
        }
    },{new:true})

    return res.json({message:"done",fav})
})



export const removeFromFavourites = asyncHandler(async(req,res,next)=>{
    const {productId} = req.params

    const fav = await productModel.findOneAndUpdate({favourites:productId},{
        $pull:{
            favourites:productId
        }
    },{new:true})

    return res.json({message:"done",fav})
})

