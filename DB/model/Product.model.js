import { Schema,Types,model } from "mongoose";

const productSchema = new Schema({

    name:{type:String,unique:true,lowercase:true,required:true},
    slug:{type:String,unique:true,lowercase:true,required:true},
    description:{type:String,required:true},
    stock:{type:Number,default:1},
    price:{type:Number,default:0},
    discount:{type:Number,default:0},
    paymentPrice:{type:Number,required:true,default:0},
    colors:{type:Array},
    sizes:{type:Array},
    categoryId:{ type: Types.ObjectId, ref: 'Category', required: true},
    subcategoryId:{ type: Types.ObjectId, ref: 'SubCategory', required: true},
    brandId:{ type: Types.ObjectId, ref: 'Brand', required: true},
    image://{type:Object,max:10}, 
    { public_id:String  ,  secure_url:String},
    coverImages://[{type:Object}],
    [{public_id:String  ,  secure_url:String}],
    rateNo:{type:Number,default:0},
    avgRate:{type:Number,default:0},
    sold:{type:Number,default:0},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    wishList:[ {type: Types.ObjectId, ref: 'User'}]
},{
    timestamps:true
})

const productModel = model('Product',productSchema)
export default productModel