import { Schema, Types, model } from "mongoose";
import orderModel from "./Order.model.js"
import { roles } from "../../src/middleware/validation.js";
import couponModel from "./Coupon.model.js";
const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    firstName:String,
    lastName:String,
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    // active: {
    //     type: Boolean,
    //     default: false,
    // },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    blocked: {
        type: Boolean,
        default: false, //soft delete
    },
    image: String,
    DOB: String,
    code:String,
    favourites:[{type:Types.ObjectId,ref:"Product"}]
}, {
    timestamps: true
})


userSchema.post('save',async function (){
    this.firstName = this.name.split(' ')[0]
    this.lastName = this.name.split(' ')[1]
})
// mmkn lma neegy n3ml delete le user nwdeeh le 7etet soft delete
userSchema.post('deleteOne',async function (doc){
    if(doc.role == roles.user)
    {
        await orderModel.deleteOne({createdBy:doc._id})
    await cartModel.deleteOne({userId:doc._id})
    //mmkn n3ml lel user da pull mn array 
    //3ayz 2t2kd bs lw ana shelto hy2sr 3la num of users wla l2 
  //  await couponModel.updateOne({})
    
}
})

//mmkn azwd address k array a7ot feeh locations el howa 2alha abl keda 

const userModel = model('User', userSchema)
export default userModel