import slugify from "slugify";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { apiFeatures } from "../../../utils/ApiFeatures.js";



export const SubCategories = asyncHandler(async(req,res,next)=>{
    //console.log(req.params)
    let api = new apiFeatures(subcategoryModel.find(),req.query).paginate().sort().filter().search().fields()
    

    //const products = await  api.mongooseQuery 
    const subcategory = await api.mongooseQuery //subcategoryModel.find(req.params).populate('categoryId')
    return res.json({pageno:api.page,message:"done", subcategory })
})


export const addSubCategory = asyncHandler(async(req,res,next)=>{

    const {name}= req.body
    const {categoryId} = req.params
    //console.log({name,categoryId})

const slug = slugify(name)
const category = await categoryModel.findById({_id:categoryId})
if(!category)
{
    return next(new Error("category not found"))
}
    const checkName = await subcategoryModel.findOne({name})
    if(checkName)
    {
        return next(new Error("name already exist"))
    }
    if(!req.file)
    {
        const subCategory = await subcategoryModel.create({name,createdBy:req.user._id,slug,categoryId})
    return res.json({message:"done",subCategory})
    }
const { secure_url , public_id} = await cloudinary.uploader.upload(req.file.path)//,{folder:"subcategory"})

    const subCategory = await subcategoryModel.create({name,slug,categoryId,createdBy:req.user._id,image:{secure_url,public_id}})
    return res.json({message:"done",subCategory})
})



export const deleteSubCategory = asyncHandler(async(req,res,next)=>{

    const {_id} = req.params
//console.log(_id)
    const del = await subcategoryModel.findByIdAndDelete({_id})
    if(!del)
    {
        //return res.json({message:"done",del})
        return next(new Error("not found",del))
    }
    return res.json({message:"done",del})
})


export const updateSubCategory = asyncHandler(async(req,res,next)=>{
    const {_id,name,categoryId} = req.body

    const subcat = await subcategoryModel.findById(_id)
    if(!subcat)
    {
        return next(new Error("invalid id"))
    }

    const checkName = await subcategoryModel.findOne({name,_id})
    if(!checkName)
    {
        const checkName = await subcategoryModel.findOne({name})
        if(checkName)
        {
            return next(new Error("name already exist"))
        }
       
    }
    if(!req.file)
    {
        const subCategory = await subcategoryModel.findOneAndUpdate({_id},{name,slug:slugify(name)},{new:true}) //lazm a7aded update ehh bzbt msh update one
        return res.json({message:"done",subCategory})
    }

    await cloudinary.uploader.destroy(subcat.image.public_id)
   const {secure_url,public_id} =  await cloudinary.uploader.upload(req.file.path,{folder:"subCategory"})

    const subCategory = await subcategoryModel.findOneAndUpdate({_id},{name,slug:slugify(name),image:{secure_url,public_id}},{new:true})
  return res.json({message:"done",subCategory})
})



export const searchByName = asyncHandler(async(req,res,next)=>{

    const {name} = req.query
    const search = await subcategoryModel.find({
        name:{
            $regex:`^${name}`
        }
    })
    return res.json({message:"done",search})
})


export const subcatById = asyncHandler(async(req,res,next)=>{
    const {_id}=req.params

    const subcategory = await subcategoryModel.findById(_id)
    if(!subcategory)
    {
        return next(new Error("subCategory not found"))
    }
    return res.json({message:"done",subcategory})
})



// 6- add subCategory
// 7- update subCategory
// 8- delete subCategory
// 9- search category
// 10- get category by id
// 11- get all categories