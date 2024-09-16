import Joi from "joi";

const registerUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    email: Joi.string().max(100).email().required()
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).email().required(),
    password: Joi.string().max(100).required()
})

export {
    registerUserValidation,
    loginUserValidation
}
