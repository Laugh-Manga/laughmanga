const joi = require('joi')

const userValidate = (data) => {
    const userSchema = joi.object({
        userName: joi
            .string()
            .trim()
            .lowercase()
            .min(3)
            .max(25)
            .required()
            .pattern(new RegExp(/^\S*$/))
            .strict(),
        email: joi.string().email(),
        password: joi.string().trim().min(8).required(),
        showName: joi.string().max(50),
        role: joi.boolean(),
    })
    return userSchema.validate(data)
}

const emailValidate = (data) => {
    const emailSchema = joi.object({
        email: joi.string().email(),
    })
    return emailSchema.validate(data)
}

const resetValidate = (data) => {
    const passwordSchema = joi.object({
        token: joi.string().required(),
        newPassword: joi.string().trim().min(8).required(),
    })
    return passwordSchema.validate(data)
}

module.exports = {
    userValidate,
    emailValidate,
    resetValidate,
}
