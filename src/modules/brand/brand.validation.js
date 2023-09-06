import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addbrand = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updatebrand = {
    body: joi.object().required().keys({
        name: generalFields.name,
        _id: generalFields.id
    }),
   // file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const deletebrand = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        _id: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchbyId = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        _id: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const searchbyName = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        name: generalFields.name
    })
}