'use strict'

const bcrypt = require('bcrypt')

// Models
const userModel = require('../models/user.model')

// Validations
const {userValidate} = require('../validations/user.validation')

// Helpers
const {
    getAllKeys,
    delCache,
    redis,
} = require('../helpers/connectToRedis.helper')

var that = (module.exports = {
    addUser: async (data) => {
        const {value, error} = userValidate(data)

        if (error) {
            return {
                error: error.details[0].message,
                data: {
                    userNameIsExist: null,
                    dataUser: null,
                },
            }
        }

        const {userName, email, password, showName, role} = value
        const isExist = await userModel.findOne({
            userName,
        })

        if (!isExist) {
            const newUserOject = new userModel({
                userName,
                email,
                password,
                showName,
                role,
            })

            const savedUser = await newUserOject.save()

            return {
                error: null,
                data: {
                    userNameIsExist: null,
                    dataUser: savedUser,
                },
            }
        }

        return {
            error: null,
            data: {
                userNameIsExist: userName,
                dataUser: null,
            },
        }
    },

    getListUsers: async () => {
        let userMap = {}
        const userOjects = await userModel.find({})
        userOjects.forEach((userOject) => {
            const {password, ...others} = userOject._doc
            userMap[userOject._id] = others
        })
        return {
            data: userMap,
        }
    },

    getUser: async (data) => {
        var userMap = {}
        const userOject = await userModel.findOne({_id: data})
        if (!userOject) {
            return {
                error: `This ID:${data} isn't exist!`,
                data: null,
            }
        }
        const {password, ...others} = userOject._doc
        return {
            error: null,
            data: others,
        }
    },

    updateUser: async (data) => {
        const {value, error} = userValidate(data.body)

        if (error) {
            return {
                error: error.details[0].message,
                data: {
                    userNameIsExist: null,
                    dataUser: null,
                },
            }
        }

        const isExist = await userModel.findOne({userName: value.userName})
        if (!isExist || isExist.id === data.params.id) {
            const userOjectStatus = await userModel.findByIdAndUpdate(
                data.params.id,
                value,
                {new: true},
            )
            const savedUser = await userOjectStatus.save()
            const {password, ...others} = savedUser._doc
            return {
                error: null,
                data: {
                    userNameIsExist: null,
                    dataUser: others,
                },
            }
        }
        return {
            error: null,
            data: {
                userNameIsExist: isExist.userName,
                dataUser: null,
            },
        }
    },

    deleteUser: async (data) => {
        const userOject = await userModel.findOne({_id: data})
        if (userOject) {
            await delCache(userOject.userName)
            await userModel.deleteOne(userOject)
            return {
                error: null,
                data: userOject,
            }
        } else {
            return {
                error: "ID isn't invalid",
                data: null,
            }
        }
    },

    getListRefreshTokens: async () => {
        const listRefreshTokens = await getAllKeys()
        return {
            data: listRefreshTokens,
        }
    },

    getRefreshToken: async (data) => {
        const refreshToken = await redis.get(data)
        if (!refreshToken) {
            return {
                error: `This refresh token of user ${data} isn't exist or expired!`,
                data: null,
            }
        }
        return {
            error: null,
            data: refreshToken,
        }
    },

    deleteRefreshToken: async (data) => {
        const key = await delCache(data)
        if (!key) {
            return {
                error: `This refresh token of user ${data} isn't exist or expired!`,
                data: null,
            }
        }
        return {
            error: null,
            data: data,
        }
    },
})
