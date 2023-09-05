import { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true, unique: true,lowerCase:true },
    slug: { type: String, required: true, unique: true,lowerCase:true },
    image: { public_id:String  ,  secure_url:String },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true}
})
categorySchema.virtual('SubCategory',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'    
})

const categoryModel = model('Category', categorySchema)

export default categoryModel