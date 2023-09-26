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
//ay 7aga 8eer plus msh lazm 23mlha parse 3shan tb2a integer
export const adddProduct = asyncHandler(async(req,res,next)=>{
    let {name,price,discount,categoryId,subcategoryId,brandId}=req.body

    const product = await productModel.findOne({name})
    if(product)
    {
        //JSON.parse or Number() 
        //to increase stock if product found
        product.stock = Number(req.body.quantity) + product.stock 
       // console.log({stock:product.stock,quantity:JSON.parse(req.body.quantity)})
       await product.save() 
       return res.json({product})
    }

    // to check that every cat or subcat or brand is already in database
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

    // to handle discount and paymentPrice
    req.body.paymentPrice = price - (price * ((discount || 0) / 100))

    
    req.body.stock =  req.body.quantity 

    // who logged in is who created the product
    req.body.createdBy = req.user._id

    // to convert sizes from String to array or to its type 
    if(req.body.sizes)
    {
        req.body.sizes =  JSON.parse(req.body.sizes)
    }
//// to convert colors from String to array or to its type 
    if(req.body.colors)
    {
        req.body.colors = JSON.parse(req.body.colors)
    }

    //to upload profile image for product 
    const { public_id,secure_url} = await cloudinary.uploader.upload(req.files.image[0].path,{folder:`product/profileImage/${req.body.user}`})
    req.body.image = { public_id,secure_url}

//3ayz 23rf hena hyfr2 ehh lw 7ateet length aw m7ttosh bsbb error el bytl3
    if(req.files.coverImages)
    {
        let coverImagesarr = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
            let { public_id,secure_url} = await cloudinary.uploader.upload(req.files.coverImages[i].path,{folder:`product/CoverImages/${req.body.user}`})
            coverImagesarr.push({ public_id,secure_url})
        }
        req.body.coverImages = coverImagesarr
    }

   // console.log({name,price,discount,paymentPrice})
    console.log(req.body.sizes,req.body.colors)
    console.log("==============================")
    console.log(req.files.coverImages)


    const product2 = await productModel.create(req.body)
    return res.json({product:product2})
   // return res.json({product:req.body,req.body.paymentPrice})
})

// is there difference lma 23ml push le array mn images gowa coverimages 
// aw 23ml push l image wa7da bas kol mara  
export const updateProductt = asyncHandler(async(req,res,next)=>{
    let {name,price,discount,categoryId,subcategoryId,brandId}=req.body
    const product = await productModel.findOne({_id:req.body._id,createdBy:req.user._id})
   if(!product)
   {
    const product = await productModel.findById(req.body._id)
    if(!product)
    {
        return next(new Error("product not found"))
    }
    else{
        return next(new Error("u are not authorized"))
    }
   }

   if(name)
   {
    const findName = await productModel.findOne({name})
    if(findName)
    {
        return next(new Error("product already exist"))
    }
product.name = name
   }
   //to increase stock
   product.stock = Number(req.body.quantity) + product.stock

   if(req.body.price ) //hyn3ks 3la paymentPrice
   {
    if(req.body.discount)
    {
        product.discount = req.body.discount
    }
    product.price = req.body.price
    console.log(product.price)
    product.paymentPrice = product.price - ( product.price * (discount || product.discount || 0) / 100)
    console.log({paymentPrice:product.paymentPrice,discount,discount:product.discount,discountofBody:discount})
   }

   if(!req.body.price && req.body.discount)
   {
    product.discount = req.body.discount
    product.paymentPrice = product.price - ( product.price * (product.discount || 0) / 100)
    console.log({paymentPrice:product.paymentPrice,discount,discount:product.discount,discountofBody:discount})
   }
   
   // colors sizes images
   //front end ygeblo data bta3tha w howa y5tar yzwd aw y3mlha mn awl w gdeed
   // w fe nafs elwa2t akny bd5lha mn awl w gdeed 
   // ana faker en feeh 7aga kanet btsbt value 3la input msln w lw 3ayz t3dl feeha t3dl

   if(req.files.image)
   {
    await cloudinary.uploader.destroy(product.image.public_id)
    const {public_id,secure_url} = await cloudinary.uploader.upload(req.files.image[0].path,{folder:`product/profileImage/${req.user._id}`})
   }
   //b3ml check lw images exceded limit mo3yn
// ana 3mlt array = product array eladeem w b3deeha b3ml push 3la array dah 
   if(req.files.coverImages)
   {
    let coverImagesarr = product.coverImages
    if(req.files.coverImages.length + coverImagesarr.length > 4)
    {
        console.log(req.files.coverImages.length , coverImagesarr.length,req.files.coverImages.length + coverImagesarr.length)
        return next(new Error("images limit exceded"))
    }
    console.log(req.files.coverImages.length , coverImagesarr.length , req.files.coverImages.length + coverImagesarr.length)

    //console.log(req.files.coverImages) 
    // for (let i = coverImagesarr.length; i < req.files.coverImages.length + coverImagesarr.length; i++) {
    //     console.log(i)
    //     let {public_id,secure_url} = await cloudinary.uploader.upload(req.files.coverImages[i].path,{folder:`product/CoverImages/${req.body.user}`})
    //     coverImagesarr.push({public_id,secure_url})
    // }
    // req.body.coverImages = coverImagesarr


    for (let i = 0; i < req.files.coverImages.length; i++) {
       // console.log(i)
        let {public_id,secure_url} = await cloudinary.uploader.upload(req.files.coverImages[i].path,{folder:`product/CoverImages/${req.user._id}`})
        //el mawgood fe index el2wl byt3mlo push gowa original array
        //b3ml push lel images gowa array original
        coverImagesarr.push({public_id,secure_url})
    }
    req.body.coverImages = coverImagesarr

   }
   await product.save()

   return res.json({product})
   //console.log({stock:product.stock,quantity:Number(req.body.quantity)})
//console.log(req.body)
    
})







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





