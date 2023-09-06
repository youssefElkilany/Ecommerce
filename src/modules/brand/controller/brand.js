import slugify from "slugify";
import brandModel from "../../../../DB/model/Brand.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";


export const getbrands = asyncHandler(async(req,res,next)=>{
    
    const brands = await brandModel.find()
    return res.json({message:"done",brands})
})







export const addbrand = asyncHandler(async(req,res,next)=>{

    const {name} = req.body

    const checkName = await brandModel.findOne({name})
    if(checkName)
    {
        return next(new Error("name already exist"))
    }
    const slug = slugify(name)
    if(!req.file)
    {
        const brand = await brandModel.create({name,slug,createdBy:req.user._id})
        return res.json({message:"done",brand})
    }

    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:"brand"})
    const brand = await brandModel.create({name,slug,createdBy:req.user._id,logo:{secure_url,public_id}})
    return res.json({message:"done",brand})
})


export const updatebrand = asyncHandler(async(req,res,next)=>{

    const {name,_id}=req.body
   // console.log(name)
    const slug = slugify(name)
    const checkbrand = await brandModel.findById({_id})
    if(!checkbrand)
    {
        return next(new Error("invalid id"))
    }

    const checkName = await brandModel.findOne({name,_id})
    if(!checkName)
    {
        const checkName = await brandModel.findOne({name})
        {
            if(checkName)
            {
                return next(new Error("name already exist"))
            }

        }
    }
    if(!req.file)
    {
        const brand = await brandModel.findOneAndUpdate({_id},{name,slug},{new:true})
        return res.json({message:"done",brand})
    }

    await cloudinary.uploader.destroy(checkbrand.logo.public_id)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:"brand"})

    const brand = await brandModel.findOneAndUpdate({_id,createdBy:checkbrand.createdBy},{name,slug,logo:{secure_url,public_id}},{new:true})
        return res.json({message:"updated",brand})
    
})

export const deletbrand = asyncHandler(async(req,res,next)=>{

    const {_id}=req.params

    const brand = await brandModel.findByIdAndDelete({_id})
    if(!brand)
    {
        return next(new Error("not found"))
    }

    return res.json({message:"deleted"})
})


export const brandbyId = asyncHandler(async(req,res,next)=>{

    const {_id}=req.params

    const brand  = await brandModel.findById({_id})
    return res.json({message:"done",brand})
})


export const searchbyName = asyncHandler(async(req,res,next)=>{

    const {name}=req.query

    const brand  = await brandModel.find({
        name:{
            $regex: `^${name}`
        }
    })
    return res.json({message:"done",brand})
})
