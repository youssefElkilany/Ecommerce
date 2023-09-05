import { model, Schema, Types } from 'mongoose';


const subcategorySchema = new Schema({
    name: { type: String, required: true, unique: true,lowerCase:true },
    slug: { type: String, required: true, unique: true,lowerCase:true },
    image: { public_id:String  ,  secure_url:String },
    categoryId:{ type:Types.ObjectId ,  ref:'Category' , required:true},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
})

const subcategoryModel = model('SubCategory', subcategorySchema)

export default subcategoryModel