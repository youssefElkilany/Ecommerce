import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const addProduct = {
    body: joi.object().required().keys({
        name: generalFields.name,
        price:joi.number().required(),
        discount:joi.number().min(0).max(100).required(),
        sizes:joi.array().required(),
        colors:joi.array().required(),//n3mlha custom
        categoryId:generalFields.id.required(),
        subcategoryId:generalFields.id.required(),
        brandId:generalFields.id.required()
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}