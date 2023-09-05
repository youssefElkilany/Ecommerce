import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const addCoupon= {
    body: joi.object().required().keys({
        code:generalFields.name,
        amount:joi.number().min(0).max(100).required(),
        expireDate: joi.date().greater('now').required()

    }),
    //file: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}