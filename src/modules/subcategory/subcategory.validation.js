import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addSubCategory = {
    body: joi.object().required().keys({
        name:generalFields.name
    }),
    file: generalFields.file,
    params: joi.object().required().keys({ categoryId:generalFields.id.required()}),
    query: joi.object().required().keys({})
}

export const updateSubCategory = {
    body: joi.object().required().keys({
        name: generalFields.name,
        _id: generalFields.id.required()
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        SubcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deleteSubCategory = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        _id: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchSubCategory = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        searchKey: generalFields.name
    })
}