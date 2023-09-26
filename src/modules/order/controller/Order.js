import { asyncHandler } from "../../../utils/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import Stripe from "stripe";
import sendEmail from "../../../utils/email.js";
import { nanoid } from "nanoid";
import createInvoice from "../../../utils/PDFKits.js";
import jwt from "jsonwebtoken";
//to open connection to stripe
const stripe = new Stripe(process.env.stripe_Key)


export const getOrderByUserId = asyncHandler(async(req,res,next)=>{

    const order = await orderModel.find({createdBy:req.user._id})
    return res.json({order:order})
}) 



export const addOrder = asyncHandler(async(req,res,next)=>{

    let {Coupon,products,address,phoneNo,price,paymentPrice,quantity,note,paymentMethod} = req.body
//products gaya mn postman
if(!req.body.products)
{
    const cart = await cartModel.findOne({userId:req.user._id})
    products = cart.products
    if(!products.length)
    {
        return next(new Error("cart is empty"))
    }
}

    //coupon
    if(Coupon)
    {

    const checkCoupon = await couponModel.findOne({code:Coupon})
    if(!checkCoupon)
    {
        return next(new Error("code not found"))
    }
    if(checkCoupon.expireDate < Date.now())
    {
        return next(new Error("coupun expired"))
    }
    if(checkCoupon.numOfUses <= checkCoupon.usedBy.length)
    {
        return next(new Error("coupun exceeded num of uses"))
    }
    if(checkCoupon.usedBy.includes(req.user._id))
    {
        return next(new Error("coupon used before"))
    }
    //3shan a5ly 3ndy variable a3rf a5od meno eldata bara 
    req.body.Coupon = checkCoupon
}

//products
//console.log(products)
const productarr = [],foundedIds = [] , productStock = [] 
let totalprice = 0
for (const o of products) {
    //product gaya mn product model
    const product = await productModel.findById(o.product) 
    if(!product)
    {
        return next(new Error(`product not found`))
       
    }
    if(o.quantity> product.stock)
    {
        return next(new Error(`only  ${product.stock} in stock`)) 
    }

    productarr.push({
        product:{
            name: product.name,
            price:product.price,
            paymentPrice: product.paymentPrice,
            productId:product._id
        },
        quantity: o.quantity
        
    })
    
    productStock.push({product:product,quantity:o.quantity})

    foundedIds.push({
        id:o.product
    })

    //total price lel products kolha mn 8eer Coupon
    totalprice += product.paymentPrice * o.quantity


    
//delete ay 7aga kant fel cart b nafs product 
    // const cart = await cartModel.updateOne({userId:req.user._id},{
    //     $pull:{
    //         products:{
    //             product:o.product
    //         }
    //     }
    // })

  
 
}

//console.log(productStock)
for (const product of productStock) {
  //  console.log(product.product.stock,product.quantity)
  //console.log(product.product)
    product.product.stock = product.product.stock - product.quantity
    await product.product.save()
}

//delete ay 7aga kant fel cart b nafs product





paymentPrice = (totalprice - (totalprice * (req.body.Coupon?.amount || 0)/100))

 const order =  await orderModel.create({couponId:req.body.Coupon?._id,
    products:productarr
    ,price:totalprice
    ,paymentPrice,
    address,phoneNo,note,paymentMethod,
    status:paymentMethod == 'card' ? 'waitingForPayment': 'placed',
    createdBy:req.user._id})


    
// //elest5dm coupon mara yt7at fel list
if(req.body.Coupon)
{
    await couponModel.updateOne({code:Coupon},{
        $addToSet:{
            usedBy:req.user._id
        }
    })
}


//to delete cart or products that exist in cart 
// if(req.body.products)
// {
// const cart = await cartModel.updateOne({userId:req.user._id},{
//     $pull:{
//         products:{
//             product:{
//                 $in:foundedIds
//             } 
//         }
//     }
// })
// }
// else{
//     const cart = await cartModel.updateOne({userId:req.user._id},{products:[]})
// }

// console.log({order:order.products.name})

//invoice ==============================

// const orderCode = `${req.user.email}_${nanoid(3)}`
//   // generat invoice object
//   const orderinvoice = {
//     shipping: {
//       name: req.user.email,
//       address: order.address,
//       city: 'Cairo',
//       state: 'Cairo',
//       country: 'Cairo',
//     },
//     orderCode,
//     date: order.createdAt,
//     items: order.products,
//     subTotal: order.price,
//     paidAmount: order.paymentPrice,
//   }
//   // fs.unlink()
//   await createInvoice(orderinvoice, `${orderCode}.pdf`)
//   await sendEmail({
//     to: req.user.email,
//     subject: 'Order Confirmation',
//     message: '<h1> please find your invoice pdf below</h1>',
//     attachments: [
//       {
//         path: `./Files/${orderCode}.pdf`,
//       },
//     ],
//   })
  //return res.status(201).json({ message: 'Done', order })





if(paymentMethod == 'card')
{
    if(req.body.Coupon)
    {
        const coupon = await stripe.coupons.create({percent_off:req.body.Coupon.amount,duration:'once'})
        req.body.stripeCoupon = coupon.id
    }
    const successToken = jwt.sign({order:order._id},'tokenSuccssess')
    //byb2l data k string fa 3shan keda we converted id to string 
    const session = await stripe.checkout.sessions.create({
        
        payment_method_types:['card'],
        mode:'payment',
        customer_email:req.user._id,
        metadata:{
            orderId:order._id.toString()
        },
        success_url:`${req.protocol}://${req.headers.host}/order/successOrder?token= ${successToken}`,
        cancel_url:process.env.Cancel_Url,
        
        discounts:req.body.stripeCoupon? [{coupon:req.body.stripeCoupon}]:[],
        line_items:productarr.map(ele=>{
            return{
                price_data:{
                    currency:"EGP",
                    product_data:{
                        name:ele.product.name
                    },
                    unit_amount:ele.product.paymentPrice * 100
                },
                quantity:ele.quantity
            }
        })
       
    })

    return res.json({message:"order successfull",order,url:session.url})  
}







return res.json({message:"order successfull",order})  
   

})



export const successUrl= asyncHandler(async(req,res,next)=>{

    const {successToken} = req.query

    const token =  jwt.verify(successToken,"tokenSuccssess")
    if(token)
    {
        return res.json({message:"invalid token"})
    }

    console.log(token.order)
    const order = await orderModel.findById(token.order)
    if(!order)
    {
        return next(new Error("order not found"))
    }
    return res.json({order})
    
})


//event.data.object.metadata
export const webhook = asyncHandler(async(req, res) => {
    const sig = req.headers['stripe-signature'].toString();
  
    let event;
  
    try {
        //console.log({endpointSecret:process.env.endpointSecret})
      event = stripe.webhooks.constructEvent(req.body,sig, process.env.endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
if(event.type == 'checkout.session.completed')
{
    const order = await orderModel.findByIdAndUpdate({_id:event.data.object.metadata},{
        status: 'placed'
    },{new:true})
    console.log(order)
   return res.json({order:order})
}
else{
    res.json({message:"invalid payment"})
}

    // switch (event.type) {
    //   case 'checkout.session.completed':
    //     const order = await orderModel.findByIdAndUpdate({_id:event.data.object.metadata},{
    //         status: 'placed'
    //     },{new:true})
    //    return res.json({order:order})
    //     break;
    //   // ... handle other event types
    //   default:
    //     res.json({message:"invalid payment"})
    //     //console.log(`Unhandled event type ${event.type}`);
    // }
   
    // // Return a 200 res to acknowledge receipt of the event
    // res.send()
  });
