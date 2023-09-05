import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addtoCart = {
    body: joi.object().required().keys({
        productId: generalFields.id,
        quantity:joi.number().required()
    }),
    // file:  joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const deleteFromCart = {
    body:joi.object().required().keys({}),

    //file:  joi.object().required().keys({}),
    params: joi.object().required().keys({product:generalFields.id}),
    query: joi.object().required().keys({})
}
