import { Schema,Types,model } from "mongoose";

const orderSchema = new Schema({
   
   // userId:{type:Types.ObjectId,ref:'User',required:true},
    products:[
        {
            product:{
                name:{type:String,required:true},
                price:{type:Number,default:0},
                paymentPrice:{type:Number,required:true,default:0},//3shan 7agat products mtt8yrsh lma ashtry order
                productId:{
                    type:Types.ObjectId,ref:'Product',required:true
                }
            },
            quantity:{type:Number,required:true,default:1}
           
        }
    ],
    address:{type:String,required:true},
    phoneNo:{type:Number,required:true,length:11}, //length mmkn ttl3 error
    note:{type:String},
    couponId:[{type:Types.ObjectId,ref:'Coupon'}],
    price:{type:Number,default:0},
    paymentPrice:{type:Number,required:true,default:0},
    paymentMethod:{type:String,default:'Cash',enum:['Cash','card']},
    status:{type:String,default:'placed',enum:['waitingForPayment','onTheWay','cancelled','delivered','placed']},
    reason:String,
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
},{
    timestamps:true
})

const orderModel = model('Order',orderSchema)
export default orderModel 