import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updateCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
        _id: generalFields.id
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const deleteCategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        categoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchCategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        skey: generalFields.name
    })
}