import { Schema,Types,model } from "mongoose";

const couponSchema = new Schema({
    code:{type:String,required:true,unique:true},
    usedBy:[{type:Types.ObjectId,ref:'User',required:true}],
    amount:{type:Number,required:true,min:0,max:100},
    numOfUses:{type:Number},
    expireDate:{type:Date,required:true,min:Date.now},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true }
},{
    timestamps:true
})

const couponModel = model('Coupon',couponSchema)
export default couponModel