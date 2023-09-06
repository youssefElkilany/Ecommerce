import slugify from "slugify";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { apiFeatures } from "../../../utils/ApiFeatures.js";




export const getproducts = asyncHandler(async(req,res,next)=>{
   
    let api = new apiFeatures(productModel.find(),req.query).paginate().sort().filter().search().fields()
    
//console.log(req.query)
    const products = await  api.mongooseQuery //productModel.find() //api.mongooseQuery
    return res.json({page:api.page,products})
})



// export const addProduct = asyncHandler(async(req,res,next)=>{
//     let {name,price,discount,categoryId,subcategoryId,brandId}=req.body
//    // price = JSON.parse(price)
// //console.log({name,price,discount,categoryId,subcategoryId,brandId})

//     const checkproduct = await productModel.findOne({name})
//     if(checkproduct)
//     {

//          checkproduct.stock += JSON.parse( req.body.quantity)
//          await checkproduct.save()
//          return res.json({message:"done",product:checkproduct})

//     }

//     const category = await categoryModel.findById({_id:categoryId})
//     if(!category)
//     {
//         return next(new Error("category not found"))
//     }
//     const subcategory = await subcategoryModel.findById({_id:subcategoryId})
//     if(!subcategory)
//     {
//         return next(new Error("subCategory not found"))
//     }
//     const brand = await brandModel.findById({_id:brandId})
//     if(!brand)
//     {
//         return next(new Error("brand not found"))
//     }

//     req.body.slug = slugify(name)

//    req.body.paymentPrice = price - (price * ((discount || 0) / 100))  //ngarab hena mn3mlsh or 
//     req.body.stock = req.body.quantity

//     if(req.body.sizes)
//     {
//         req.body.sizes  = JSON.parse(req.body.sizes)
//     }
//     if(req.body.colors)
//     {
//         req.body.colors  = JSON.parse(req.body.colors)
//     }

//     if(!req.file.image)
//     {
//         const product = await productModel.create(req.body)
//         return res.json({message:"done",product})
//     }
// //fadel coverImages
// const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:"product"})
// //console.log(req)
// console.log({paymentPrice:paymentPrice})
//     const product = await productModel.create(req.body)
//     return res.json({message:"done",product})

// })



export const addProduct = asyncHandler(async(req,res,next)=>{
    let {name,price,discount,categoryId,subcategoryId,brandId}=req.body
   

    const checkproduct = await productModel.findOne({name})
    if(checkproduct)
    {
        checkproduct.stock += JSON.parse( req.body.quantity)
         await checkproduct.save()
         return res.json({message:"done",product:checkproduct})
    }

    const category = await categoryModel.findById({_id:categoryId})
    if(!category)
    {
        return next(new Error("category not found"))
    }
    const subcategory = await subcategoryModel.findById({_id:subcategoryId})
    if(!subcategory)
    {
        return next(new Error("subCategory not found"))
    }
    const brand = await brandModel.findById({_id:brandId})
    if(!brand)
    {
        return next(new Error("brand not found"))
    }

    req.body.slug = slugify(name)

   req.body.paymentPrice = price - (price * ((discount || 0) / 100))   
    req.body.stock = req.body.quantity

    if(req.body.sizes)
    {
        req.body.sizes  = JSON.parse(req.body.sizes)
    }
    if(req.body.colors)
    {
        req.body.colors  = JSON.parse(req.body.colors)
    }

    // if(!req.files.image)
    // {
    //     const product = await productModel.create(req.body)
    //     return res.json({message:"done",product})
    // }
   // console.log(req.body.image)
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.image[0].path,{folder:"product/image"})
    req.body.image = {secure_url,public_id}


if(!req.files.coverImages)
{
    const product = await productModel.create(req.body)
    return res.json({message:"done",product})
}
//console.log("gg")
//bytl3 error lw enta md5ltsh coverImages 3la (length)
    if(req.files.coverImages.length)
    {
        const coverImages = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
           
            let {secure_url,public_id} = await cloudinary.uploader.upload(req.files.coverImages[i].path,{folder:"product/coverImages"})
            coverImages.push({secure_url,public_id})
        }
        req.body.coverImages = coverImages
    }
  // return res.json({files:req.files})

//console.log({paymentPrice:paymentPrice})
    const product = await productModel.create(req.body)
    return res.json({message:"done",product})

})

 

export const updateProduct = asyncHandler(async(req,res,next)=>{

    const {_id,name,price,discount} = req.body
//let stock = req.body
 req.body.slug = slugify(name)
    const product = await productModel.findById({_id})
    if(!product)
    {
        return next(new Error("product not found"))
    }

    const checkName = await productModel.findOne({_id,name})
    if(!checkName)
    {
        const checkName = await productModel.findOne({name})
        if(checkName)
        {
            return next(new Error("name already exist"))
        }

    }
  // stock = JSON.parse(stock)
        // to update stock msh sh8ala ya mawlana
        if(req.body.stock)
        {
           // product.stock = JSON.parse(product.stock)
            product.stock += JSON.parse(req.body.stock) 
        }

        
    
        req.body.paymentPrice = price - (price * (discount || 0) /100)
        
   
 // lw md5lsh images
 if(req.files.image )
 {
    const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.image[0].path,{folder:'product/image'})
    req.body.image =  {secure_url,public_id}
 }


if(product.coverImages.length>9)
{
return next(new Error("photo limit exceded 1"))
}

   

    if(!req.files.coverImages)
    {
        const update  = await productModel.findOneAndUpdate({_id},req.body,{new:true})
        return res.json({message:"done",Results:update})
    }

    if(req.files.coverImages.length)
    {
        if((req.files.coverImages.length + product.coverImages.length )>12)
        {
            return next(new Error("photo limit exceded 2"))
        }
        const coverImages = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
            const {secure_url,public_id} = await cloudinary.uploader.upload(req.files.coverImages[i].path,{folder:'product/coverImage'})
            coverImages.push({secure_url,public_id})

            //product.coverImages.push(coverImages)
        }
       
        req.body.coverImages = coverImages
        //product.coverImages.push(coverImages)
    }
//mmkn n3ml push lel images 3shan tt3mlha push 3ady msh ka array

    const update  = await productModel.findOneAndUpdate({_id},{product:req.body,$push:{coverImages:req.body.coverImages}} ,{new:true})
    //const update  = await productModel.findOneAndUpdate({_id},{product:req.body} ,{new:true})
    return res.json({message:"done",result:update})
})


export const deleteproduct = asyncHandler(async(req,res,next)=>{
    const {_id}=req.params

    const checkcat = await productModel.findByIdAndDelete({_id})
    if(!checkcat)
    {
        return next(new Error("not found"))
    }
    if(checkcat.createdBy!= req.user._id)
    {
        return next(new Error("u are not authorized to delete this product"))
    }
   // checkcat.image.public_id
     await cloudinary.uploader.destroy(checkcat.image.public_id)
     await cloudinary.uploader.destroy(category.coverImages.public_id)
    //  checkcat.forEach(async category => {
    //     await cloudinary.uploader.destroy(category.coverImages.public_id)
    //  });

    return res.status(StatusCodes.ACCEPTED).json({ message: "deleted", checkcat })
})





