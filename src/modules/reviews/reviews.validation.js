import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const reviewProduct = {
    body: joi.object().required().keys({
        productId:generalFields.id,
        rating: joi.number().min(0).max(5),
        comment: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}


export const updatereview = {
    body: joi.object().required().keys({
        rating: joi.number().min(0).max(5),
        comment: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({_id:generalFields.id}),
    query: joi.object().required().keys({})
}

export const deletereview = {
    body: joi.object().required().keys({}),
    file: generalFields.file,
    params: joi.object().required().keys({_id:generalFields.id}),
    query: joi.object().required().keys({})
}
