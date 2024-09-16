import Joi from "joi";

const createCategoryValidation = Joi.object({
    name: Joi.string().max(100).required().messages({
        'string.base': 'Name should be a type of text',
        'string.max': 'Name should not exceed 100 characters',
        'any.required': 'Name is required',
    })
})

const updateCategoryValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().max(100).required(),
});

const getCategoryValidation = Joi.string().required();

const searchCategoryValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    name: Joi.string().optional(),
})

export {createCategoryValidation, searchCategoryValidation, getCategoryValidation, updateCategoryValidation}