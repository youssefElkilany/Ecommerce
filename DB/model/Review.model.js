import { Schema,Types,model } from "mongoose";

const reviewSchema = new Schema({
    rating:{type:Number,Min:0,Max:5,required:true},
    comment:{type:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    productId:{type: Types.ObjectId, ref: 'Product', required: true}


},{
timestamps:true
})
const reviewModel = model('Review',reviewSchema)

export default reviewModel