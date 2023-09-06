import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const addOrder = {
    body:joi.object().required().keys({
        Coupon:joi.string(),
        products:generalFields.id,
        address:generalFields.name,
        phoneNo:joi.string().min(11).max(11).required(),
        quantity:joi.number(),
        note:joi.string().min(50).max(100),
        paymentMethod:joi.string()
    }),

    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})


}