import slugify from "slugify";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js"
import { apiFeatures } from "../../../utils/ApiFeatures.js";


//na2es fel product pagination w na2es get product akml feeha
// na2es favourites lel product
// mmkn 23ml kaza payment system ? => stripe | paymob | fawry | paypal

export const getproducts = asyncHandler(async(req,res,next)=>{
   
    let api = new apiFeatures(productModel.find(),req.query).paginate().sort().filter().search().fields()
    
//console.log(req.query)
    const products = await  api.mongooseQuery //productModel.find() //api.mongooseQuery
    return res.json({page:api.page,products})
})




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
    // console.log("==============================")
    // console.log(req.files.coverImages)


    const product2 = await productModel.create(req.body)
    return res.json({product:product2})
   // return res.json({product:req.body,req.body.paymentPrice})
})

// is there difference lma 23ml push le array mn images gowa coverimages 
// aw 23ml push l image wa7da bas kol mara

// ======================= Update Product =============================


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


// ======================= Delete Product ====================================

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
     await cloudinary.uploader.destroy(checkcat.image[0].public_id)
     //await cloudinary.uploader.destroy(category.coverImages.public_id)
     checkcat.forEach(async category => {
        await cloudinary.uploader.destroy(category.coverImages.public_id)
     });

    return res.status(StatusCodes.ACCEPTED).json({ message: "deleted", checkcat })
})





