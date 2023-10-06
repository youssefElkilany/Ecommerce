import bcrypt from 'bcryptjs'
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import sendEmail from "../../../utils/email.js";
import CryptoJS from "crypto-js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { nanoid } from 'nanoid';
import cartModel from '../../../../DB/model/Cart.model.js';



export const signUp = asyncHandler(async(req,res,next)=>{

    let {name,email,password,repassword,phone} = req.body
console.log({name,email,password,repassword,phone})
    const checkEmail = await userModel.findOne({email})
    if(checkEmail)
    {
        return next(new Error("email already exist"))
    }
if(password!=repassword)
{
    return next(new Error("password mismatch"))
}
//console.log("gg")
const encyptedphone =  CryptoJS.AES.encrypt(phone,'secret').toString()
  
//password = hash(password)
const hashedpassword = bcrypt.hashSync(password,parseInt(process.env.SALT_ROUND))
//  console.log("gg")
  
  
 const user = await userModel.create({name,email,password:hashedpassword,phone:encyptedphone})
 
 //create cart model
 const cart = await cartModel.create({userId:user._id})
if(!cart)
{
return res.json({message:"cart already exist"})
}
 //tokens
const emailtoken =  generateToken({payload:{_id:user._id,email:user.email}})
const token2 = generateToken({payload:{_id:user._id,email:user.email}})

//body of email
 const html = `<a href = "${req.protocol}://${req.headers.host}/auth/emailConfirmation/${emailtoken}">EmailConfirmation </a>
                <br>
                <br>
                <a href = "${req.protocol}://${req.headers.host}/auth/newconfirmationemail/${token2}">Reconfirmation Email </a>`
 sendEmail({to:user.email,subject:"email confirmation",html})

 return res.status(201).json({message: "done",user})
})


export const confrimEmail = asyncHandler(async(req,res,next)=>{
    const {emailtoken} = req.params

    const token  = verifyToken({token:emailtoken})
    const user  = await userModel.findByIdAndUpdate({_id:token._id},{confirmEmail:true})
    if(!user)
    {
        return res.redirect("https://linkit.oxfordonlinepractice.com/app/signup")
    }
    return res.redirect("https://linkit.oxfordonlinepractice.com/")

})

export const newConfirmationEmail = asyncHandler(async(req,res,next)=>{
    const {emailtoken} = req.params

    const tokens = verifyToken({token:emailtoken})

    const user = await userModel.findOne({_id:tokens._id})
    if(!user)
    {
        return res.redirect("https://linkit.oxfordonlinepractice.com/app/signup")
    }
    if(user.confirmEmail)
    {
        return res.redirect("https://linkit.oxfordonlinepractice.com/")
    }

    const newtoken = generateToken({payload:{_id:user._id,email:user.email}})
    const html = `<a href =" ${req.protocol}://${req.headers.host}/auth/emailConfirmation/${newtoken}">confirmation Email </a>`

    sendEmail({to:user.email,subject:"confirmation email",html})

    return res.json({message:"check your email"})

})



export const login = asyncHandler(async(req,res,next)=>{

    const {email,password} = req.body

    //password =  hash(password)
    const user  = await userModel.findOne({email,confirmEmail:true})
   // console.log(user)
    if(!user)
    {
        return next(new Error("check ur email or password"))
    }
   const checkpass =  compare({plaintext:password,hashValue:user.password})

   if(!checkpass)
   {
    return next(new Error("check ur password"))
   }

    const token = generateToken({payload:{_id:user._id,email:user.email},signature:process.env.TOKEN_SIGNATURE})

    return res.json({message:"done",token})
})









export const signup2 = asyncHandler(async(req,res,next)=>{
    let {name,email,password,repassword,phone,role} = req.body

    const checkEmail = await userModel.findOne({email})
    if(checkEmail)
    {
        return next(new Error("email already exist"))
    }
    if(password!=repassword)
    {
        return next(new Error("password doesnt match"))
    }

   const  hashedpassword = hash({plaintext:password})
   const encyptedPhone = CryptoJS.AES.encrypt(phone,process.env.TOKEN_SIGNATURE).toString()

   const code = nanoid(6)
//create user
   const user = await userModel.create({name,email,password:hashedpassword,phone:encyptedPhone,code,role})

   //create cart model
   const cart =  await cartModel.create({userId:user._id})
   if(!cart)
   {
      return next(new Error("cart already Exist"))
   }

   const html = `code:${user.code}`
   sendEmail({to:user.email,subject:"email confirmation",html})
   
    return res.status(201).json({message: "done",user})
})

export const confirmEmail2 = asyncHandler(async(req,res,next)=>{

    const {code,email} = req.body

    const user = await userModel.findOneAndUpdate({email,code},{confirmEmail:true},{new:true})
    if(!user)
    {
        return next(new Error("invalid email or code"))
    }

    const newcode = nanoid(6)
    const user2 = await userModel.updateOne({email},{code:newcode})
   
    return res.json({message:"email is confirmed",user2})
})

// export const newconfirmEmail2 = asyncHandler(async(req,res,next)=>{

//     const {code,email} = req.body

//     const checkEmail = await userModel.findOne({email,code})
//     if(!user)
//     {
//         return next(new Error("invalid email or code"))
//     }
//     const newcode = nanoid(6)
//     const user = await userModel.updateOne({email},{code:newcode,confirmEmail:true})
//     return res.json({message:"done",user})
// })

export const sendCode = asyncHandler(async(req,res,next)=>{
    const {email} = req.body

    const user = await userModel.findOne({email})
    if(!user)
    {
        return next(new Error("invalid email"))
    }
    const code = nanoid(6)
const html = `${code}`

const updateuser = await userModel.findOneAndUpdate({email},{code},{new:true})

    sendEmail({to:user.email,subject:"forget password",html})

    return res.json({message: "done",updateuser})
})


export const forgetpassword = asyncHandler(async(req,res,next)=>{
    const {email,code,password,confirmpassword} = req.body

    const checkEmail = await userModel.findOne({email})
    if(!checkEmail)
    {
        return next(new Error("invalid email"))
    }
    if(checkEmail.code!=code)
    {
        return next(new Error("code doesnt match"))
    }
    if(password!=confirmpassword)
    {
        return next(new Error("password doesnt match"))
    }
    
    const newcode = nanoid(6)
    const user = await userModel.updateOne({email},{password,code:newcode})

    return res.json({message:"password changed"})
})