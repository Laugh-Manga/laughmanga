'use strict'

// Models
const userModel = require('../models/user.model')

// Validations
const userValidate = require('../validations/user.validation')

// Services
const {signAccessToken, signRefreshToken} = require('../services/jwt.service')

// Helpers
const {redis} = require('../helpers/connectToRedis.helper')

// Create Services
var that = (module.exports = {
    register: async (data) => {
        const {value, error} = userValidate(data)

        if (error) {
            return {
                error: error.details[0].message,
                data: {
                    userNameIsExit: null,
                    dataUser: null,
                },
            }
        }

        const {userName, password} = value
        const isExist = await userModel.findOne({
            userName,
        })

        if (!isExist) {
            const newUserOject = new userModel({
                userName,
                password,
            })

            const savedUser = await newUserOject.save()

            return {
                error: null,
                data: {
                    userNameIsExit: null,
                    dataUser: savedUser,
                },
            }
        }

        return {
            error: null,
            data: {
                userNameIsExit: userName,
                dataUser: null,
            },
        }
    },

    refreshToken: async (data) => {
        if (!data)
            return {
                error: "Can't find payload from request",
                data: {
                    accessToken: null,
                    newRefreshToken: null,
                },
            }
        const newAccessToken = await signAccessToken(data)
        const rewRefreshToken = await signRefreshToken(data)

        return {
            error: null,
            data: {
                userName: data.userName,
                role: data.role,
                newAccessToken,
                rewRefreshToken,
            },
        }
    },

    login: async (data) => {
        const {value, error} = userValidate(data)

        if (error) {
            return {
                error: {
                    errorValidate: error.details[0].message,
                    errorUnauthorized: null,
                },
                data: null,
            }
        }

        const userOject = await userModel.findOne({userName: value.userName})

        if (!userOject) {
            return {
                error: {
                    errorValidate: null,
                    errorUnauthorized: value.userName,
                },
                data: null,
            }
        }

        const isValue = await userOject.checkPassword(value.password)

        if (!isValue) {
            return {
                error: {
                    errorValidate: null,
                    errorUnauthorized: null,
                },
                data: null,
            }
        }
        const {userName, role} = userOject
        const {password, ...others} = userOject._doc
        return {
            error: {
                errorValidate: null,
                errorUnauthorized: null,
            },
            data: {
                ...others,
                accessToken: await signAccessToken({userName, role}),
                refreshToken: await signRefreshToken({userName, role}),
            },
        }
    },

    logout: async (data) => {
        if (!data)
            return {
                error: "Can't find payload from request",
                data: null,
            }
        redis.del(data.userName, (err, reply) => {
            if (err) {
                return throwError(500, 'Server Error!', res)
            }
        })
        return {
            error: null,
            data: data.userName,
        }
    },

    getListUsers: async (data) => {
        if (!data)
            return {
                error: "Can't find payload from request",
                data: null,
            }
        var userMap = {}
        const userOjects = await userModel.find({})
        // if (err){
        //     return throwError(500, 'Server Error!', res)
        // }
        userOjects.forEach((userOject) => {
            const {password, ...others} = userOject._doc
            userMap[userOject._id] = others
        })
        return {
            error: null,
            data: userMap,
        }
    },
})
