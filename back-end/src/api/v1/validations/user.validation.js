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
        password: joi.string().trim().min(8).required(),
    })
    return userSchema.validate(data)
}

module.exports = userValidate
