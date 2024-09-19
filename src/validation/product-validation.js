import Joi from "joi";

const createProductValidation = Joi.object({
    name: Joi.string().max(100).required(),
    image: Joi.string().max(100).required(),
    price: Joi.number().greater(0).required(),
    categoryId: Joi.string().guid().required(),
})

const updateProductValidation = Joi.object({
    id: Joi.string().guid().required(),
    name: Joi.string().max(100).required(),
    image: Joi.string().max(100).optional(),
    price: Joi.number().greater(0).required(),
    categoryId: Joi.string().guid().required(),
});

const getProductValidation = Joi.string().guid().required()

const searchProductValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    name: Joi.string().optional(),
})

export {createProductValidation, searchProductValidation, getProductValidation, updateProductValidation}