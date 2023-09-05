import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const rateOrder = asyncHandler(async (req,res,next)=>{

     const {productId,rating,comment} = req.body
console.log({productId,rating,comment})
     const product = await productModel.findById(productId)
     if(!product)
     {
        return next(new Error("product not found"))
     }

     const order = await orderModel.findOne({
      userId:req.user._id
      ,status:"delivered",
      'products.product.productId':productId})
console.log({order})
     if(!order)
     {
        return next(new Error("u cant review this product"))
     }

     const isReviewed = await reviewModel.findOne({createdBy:req.user._id,productId})
     if(isReviewed)
     {
      return next(new Error("u already reviewed this product"))
     }

     const review = await reviewModel.create({
        rating,
        comment,
        createdBy:req.user._id,
        productId
     })


    //  const reviews = await reviewModel.find({productId})
    //  let sum = 0
    //  for (const review of reviews) {
    //   sum+=review.rating
    //  }
    //  const avgRate = sum / review.length
    //  product.avgRate = avgRate
    //  product.rateNo = review.length
    //  product.save()

    let oldAvg = product.avgRate
    let rateNo = product.rateNo
    let sum = oldAvg * rateNo + rating
    product.avgRate = sum / (rateNo+1) 
    product.rateNo = rateNo+1 

    product.save()


     return res.json({message:"done",review,avgRate:product.avgRate})

})


export const updateReview = asyncHandler(async(req,res,next)=>{

   const {_id} = req.params
   const {rating,comment} = req.body

   
     const isReviewed = await reviewModel.findOne({createdBy:req.user._id,_id})
     if(!isReviewed)
     {
      return next(new Error("u havent reviewed this product")) //hytl3 error hena
     }

     const product = await productModel.findById(isReviewed.productId)
   if(!product)
   {
      return next(new Error("product not found")) 
   }


     let oldsum = (product.avgRate * product.rateNo) - isReviewed.rating

     const review = await reviewModel.updateOne({rating,comment})

     let newsum = oldsum + rating
     product.avgRate = newsum / product.rateNo
     product.save()

     return res.json({message:"done",review,avgRate:product.avgRate})
     

})



export const deleteReview  = asyncHandler(async(req,res,next)=>{
   const {_id} = req.params

   const review = await reviewModel.findByIdAndDelete({_id})

   const product = await productModel.findById(isReviewed.productId)
   if(!product)
   {
      return next(new Error("product not found"))
   }

   let oldSum = (product.avgRate * product.rateNo) - review.rating
   product.avgRate = oldSum / (product.rateNo-1)
   product.rateNo = product.rateNo - 1
   product.save()

   return res.json({message:"deleted"})
})