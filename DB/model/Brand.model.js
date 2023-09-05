import { model, Schema, Types } from 'mongoose';


const brandSchema = new Schema({
    name: { type: String, required: true, unique: true,lowerCase:true },
    slug: { type: String, required: true, unique: true,lowerCase:true },
    logo: { public_id:String  ,  secure_url:String },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
})

const brandModel = model('Brand', brandSchema)

export default brandModel