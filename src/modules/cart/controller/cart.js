import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";




export const getUserCart = asyncHandler(async(req,res,next)=>{

    const {id} = req.user
    
    const cart = await cartModel.findOne({userId:id}).populate([
        {
            path: 'products.product',
            select: 'name price paymentPrice',
            populate:[
                {
                    path: 'categoryId',
                    select: '  name'
                },
                {
                    path: 'brandId',
                    select: '-_id name'
                },
                {
                    path: 'subcategoryId',
                    select: '-_id name'
                }
            ]
        }
    ])

//     const productt = await productModel.find()    

// for (let i = 0; i < i; i++) {
//     if(cart.products[i].product._id != productt._id)
//     {
//         await cartModel.updateOne({userId:id},{
//             $pull:{
//                 products:{
//                     product:cart.products.product._id
//                 }
//             }
//         })
//     }
    
// }
let totalprice = 0
cart.products =  cart.products.filter(ele=>{
    if(ele?.product)
    {
         totalprice+= ele.product.paymentPrice * ele.quantity
         return ele
    }
})

   // console.log({_id:cart.products[0].product})
    //moshkela fel _id hena
   // const productt = await productModel.findById({_id:cart.products.product._id})
    // if(!productt)
    // {
    //     await cartModel.updateOne({userId:_id},{
    //         $pull:{
    //             products:{
    //                 product: cart.products.product._id
    //             }
    //         }
    //     })
    // }

//     let totalprice = 0
// await cart.products.forEach(ele=>{
//     totalprice+= ele.product.paymentPrice * ele.quantity
// })
await cart.save()

    return res.json({message:"done",cart,totalprice})

})







export const addToCart = asyncHandler(async(req,res,next)=>{
    const {productId,quantity} = req.body
    const {_id} = req.user
    const product = await productModel.findById(productId)
    if(!product)
    {
        return next(new Error("product not found"))
    }
    if(quantity>product.stock)
    {
        await productModel.updateOne({_id:productId},{
            $addToSet:{wishList:_id}
        })
        return next(new Error(`only ${product.stock} in stock`))
    }
   // console.log({_id,productId})
    const cart = await cartModel.findOne({userId:_id}) 
    if(!cart)
    {
        return next(new Error("user not found"))
    }
    //findindex bt3ml find lel index lel 7aga de gowa elarray
    //btgebly index bta3t el7aga deh gowa elarray 

    const findproduct = cart.products.findIndex(product=>{
        return product.product == productId
    })
 
    if(findproduct == -1)
    {
        cart.products.push({
            product:productId,
            quantity
        })
    }
    else
    {
        cart.products[findproduct].quantity = quantity
    }



//     for (let i = 0; i < cart.products.length; i++) {

//         let exists = false
//       if(cart.products[i].product.toString() == productId)
//       {
//         cart.products[i].quantity = quantity
//         exists = true
//        break
//       }
//       //const cart2 = await cartModel.updateOne({userId},{}) 
//     }
// if(!exists)
// {
//     // const addcart = await cartModel.updateOne({userId},{
//     //     $push:{products:p}
//     // })
//     cart.products.push({
//         product:productId,
//         quantity
//     })
// }
await cart.save()

return res.json({message:"done",cart})
})

export const addToCart2 =asyncHandler(async(req,res,next)=>{

    const {productId,quantity} = req.body
    const {userId} = req.user

    const product = await productModel.findById(productId)
    if(!product)
    {
        return next(new Error("product not found"))
    }
    if(product.stock<quantity)
    {
        return next(new Error("stock limit exceeded"))
    }

    const cart = await cartModel.findOne(userId)
    if(!cart)
    {
        return next(new Error("user not found"))
    }

    let exist = false

    for (let i = 0; i < cart.products.length; i++) {
        if(cart.products[i].product.toString() == productId)
        {
            //efrd ana mn bara zwdt quantity 3la nafs product elmawgood gowa cart 
            cart.products[i].quantity = quantity
            exist = true
            break
        }
        
    }
    if(!exist)
    {
        cart.products.push({
            product:productId,
            quantity
        })
    }
    await cart.save()
    return res.json({message:"done",cart})
})


export const deleteFromCart = asyncHandler(async(req,res,next)=>{

    const {product} = req.params
    const {_id} = req.user
//pull fel javascript btshly akher index lakn fel mongoose btshly 7aga specific elbdholha
    const cart = await cartModel.findOneAndUpdate({userId:_id,'products.product':product},{
        $pull:{
            products:{
                product:product
            }
            
        }
    },{new:true})
if(!cart)
{
    return next(new Error("product not found"))
}
    return res.json({message:"done",cart})
})