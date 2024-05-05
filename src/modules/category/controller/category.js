import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import categoryModel from "../../../../DB/model/Category.model.js";
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { asyncHandler } from "../../../utils/errorHandling.js";


// ================= get categories =====================

export const Categories = asyncHandler(async(req,res,next)=>{
    const category = await categoryModel.find()
    return res.json({message:"done", category })
})


//virtual populate
export const Categories2 = asyncHandler(async(req,res,next)=>{
    const category = await categoryModel.find().populate('SubCategory') //SubCategory
    return res.json({message:"done", category })
})



export const addCategory = asyncHandler(async (req,res,next)=>{
    
    const {name}= req.body
    const slug =slugify(name)
    const checkName = await categoryModel.findOne({name})
    if(checkName)
    {
        return res.json({Message:"name already exit"})
    }
    if(!req.file)
    {
        const category = await categoryModel.create({name,slug,createdBy:req.user._id})
  
   return res.json({Message:"done",category})
    }
    
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`category`}) 
console.log("ff")
    const category = await categoryModel.create({name,slug,createdBy:req.user._id,image:{secure_url,public_id}})

    return res.json({Message:"done",category})
  
   

})

export const deleteCategory = asyncHandler(async(req,res,next)=>{
    const {_id}=req.body

    const checkcat = await categoryModel.findByIdAndDelete({_id})
    if(!checkcat.deletedCount)
    {
        return next(new Error("not found"))
    }
    if(checkcat.createdBy!= req.user._id)
    {
        return next(new Error("u are not authorized to delete this product"))
    }
    const cloud = cloudinary.uploader.destroy(checkcat.image.public_id)
    return res.status(StatusCodes.ACCEPTED).json({ message: "deleted", checkcat })
})


// hena myf3sh nseeb el esm zy ma howa bn8yro lma bneegy n3ml update
export const updateCategory = asyncHandler(async(req,res,next)=>{

    const {name,_id} = req.body
    

    const checkcat = await categoryModel.findById({_id})  //3shan ngeeb eldata bta3t category
    if(!checkcat)
    {
        return  next(new Error("category not found"))
    }

    const checkexist = await categoryModel.findOne({name})
    if(checkexist)
    {


        // const checkexist = await categoryModel.findOne({_id,name})  //lw name dah mawgood fe nafs category el ana b3dl feeha
        // if(checkexist)
        // {

        // }
       return  next(new Error("name already exist"))

    }
    const slug = slugify(name)
    if(!req.file)
    {
        
        const update = await categoryModel.findOneAndUpdate({_id},{name,slug},{new:true})
        return res.json({message:"done",update})
    }

    const deleteImage =  await cloudinary.uploader.destroy(checkcat.image.public_id)
   // console.log("gg")
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`category`})

    const update = await categoryModel.findOneAndUpdate({_id},{name,slug,image:{secure_url,public_id}},{new:true})
    return res.json({message:"done",update})


})


export const updateCategory2 = asyncHandler(async(req,res,next)=>{
    const {name,_id} = req.body
    const slug = slugify(name)

    const checkcat = await categoryModel.findById({_id})  //3shan ngeeb eldata bta3t category
    if(!checkcat)
    {
        return  next(new Error("category not found"))
    }

    const checkexist = await categoryModel.findOne({name,_id})
    if(!checkexist)
    {//1- mmkn name yb2a mawgood bs bta3 category tany
        // 2 - w mmkn name myb2ash mawgood asln
        const checkName = await categoryModel.findOne({name})
        if(checkName)
        {
            return next(new Error("name already exist"))
        }
        
    }
    if(!req.file)
    {
        const update = await categoryModel.findOneAndUpdate({_id},{name,slug},{new:true})
        return res.json({message:"done",update})
    }

    const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:`category`})

    const update = await categoryModel.findOneAndUpdate({_id},{name,slug,image:{secure_url,public_id}},{new:true})
    return res.json({message:"done",update})

})


export const categorybyid = asyncHandler(async (req,res,next)=>{
    const {_id} = req.params

    const cat = await categoryModel.findById({_id})
    if(!cat)
    {
        return  next(new Error("category not found"))
    }
   return res.json({message:"done",cat}) 
})

export const searchCategory = asyncHandler(async(req,res,next)=>{

    const {skey} = req.query

    const search = await categoryModel.find({
        name:{
            $regex: `^${skey}`
        }
    })
return res.json({message:"done",search})
})


// 1- update category
// 2- delete category
// 3- search category
// 4- get category by id
// 5- get all categories ("virtual populate") *new*  na2es deh



// export const addCategory = async (req, res, next) => {
//     let { name } = req.body
//    // name = name.toLowerCase()
//     const isExist = await categoryModel.findOne({ name })
//     if (isExist) {
//         return next(new Error('This name already exists'))
//     }
//     // if(req.file)
//     // {

//     // }
//     //const slug = slugify(name)
//     const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'category' })
//     const category = await categoryModel.create({ name, slug:slugify(name), image: { secure_url, public_id } })
//     res.status(StatusCodes.CREATED).json({ message: "Done", category, status: ReasonPhrases.CREATED })
// }



// export const deleteCategory = async (req, res, next) => {
//     const { categoryId } = req.params
//     const isExist = await categoryModel.findByIdAndDelete(categoryId)
//     if (!isExist) {
//         return next(new Error('category not found'))
//     }
//     await cloudinary.uploader.destroy(isExist.image.public_id)
//     return res.status(StatusCodes.ACCEPTED).json({ message: "done", isExist })
// }


