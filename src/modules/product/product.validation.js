import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addProduct = { 
    body: joi.object().required().keys({
        name: generalFields.name,
        price:joi.number().positive().required(),
        discount:joi.number().min(0).max(100).required(),
        quantity:joi.number().positive().optional(),
        description:joi.string().optional(),
        sizes:joi.custom((value,helper)=>{
            value = JSON.parse(value)
            return Array.isArray(value) ? true :helper.message("In-valid size input")
        }).required(),
        colors:joi.custom((value,helper)=>{
            value = JSON.parse(value)
          return Array.isArray(value) ? true : helper.message("invalid color input")
        }).required(),//n3mlha custom
        
        categoryId:generalFields.id.required(),
        subcategoryId:generalFields.id.required(),
        brandId:generalFields.id.required()
    }),
    file: generalFields.file, // lazm 27ot kol 7aga ht5osh fel files wla deh bas ?
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}


export const updateProduct = {

    body: joi.object().required().keys({
        productId:generalFields.id.required(),
        name: joi.string().optional(),
        price:joi.number().positive().optional,
        discount:joi.number().min(0).max(100).optional,
        quantity:joi.number().optional(),
        description:joi.string().optional(),
        sizes:joi.custom((value,helper)=>{
           // console.log(value)
           value = JSON.parse(value)
            return Array.isArray(value) ? true :helper.message("In-valid size input")
        }).optional(),
        colors:joi.custom((value,helper)=>{
            value = JSON.parse(value)
          return Array.isArray(value) ? true : helper.message("invalid color input")
        }).optional(),//n3mlha custom
        categoryId:generalFields.id.required(),
        subcategoryId:generalFields.id.required(),
        brandId:generalFields.id.required()
    }),
    file: generalFields.file, // lazm 27ot kol 7aga ht5osh fel files wla deh bas ?
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})

}

export const deleteProduct = {

    body: joi.object().required().keys({}),
    params: joi.object().required().keys({productId:generalFields.id.required(),}),
    query: joi.object().required().keys({})

}
