'use strict'

// Services
const {
    addUser,
    getListUsers,
    updateUser,
    deleteUser,
    getUser,
    getListRefreshTokens,
    getRefreshToken,
    deleteRefreshToken,
} = require('../services/admin.service')

// Helper
const throwError = require('../helpers/throwError.hepler')

var that = (module.exports = {
    addUser: async (req, res, next) => {
        try {
            const {error, data} = await addUser(req.body)

            if (error) {
                return throwError(400, error, res)
            }

            if (data.userNameIsExist) {
                return throwError(
                    409,
                    `${data.userNameIsExist} has been registered!`,
                    res,
                )
            }

            return res.json({
                status: 'Account is created successfully!',
                data: data.dataUser,
            })
        } catch (error) {
            next(error)
        }
    },

    getListUsers: async (req, res, next) => {
        try {
            const {error, data} = await getListUsers()
            return res.json({
                status: 'Loading data from MongoDB is successful!',
                data: data,
            })
        } catch (error) {
            next(error)
        }
    },

    getUser: async (req, res, next) => {
        try {
            const {error, data} = await getUser(req.params.id)
            if (error) {
                return throwError(404, error, res)
            }
            return res.json({
                status: 'Loading data from MongoDB is successful!',
                data: data,
            })
        } catch (error) {
            next(error)
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const {error, data} = await updateUser(req)
            if (error) {
                return throwError(400, error, res)
            }

            if (data.userNameIsExist) {
                return throwError(
                    409,
                    `${data.userNameIsExist} has been registered!`,
                    res,
                )
            }
            return res.json({
                status: 'Account is updated successfully!',
                data: data.dataUser,
            })
        } catch (error) {
            next(error)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const {error, data} = await deleteUser(req.params.id)
            if (error) {
                return throwError(400, error, res)
            } else {
                return res.json({
                    status: 'Account is deleted successfully!',
                    data: data,
                })
            }
        } catch (error) {
            next(error)
        }
    },

    getListRefreshTokens: async (req, res, next) => {
        try {
            const {error, data} = await getListRefreshTokens()
            return res.json({
                status: 'Loading data from Redis is successful!',
                data: data,
            })
        } catch (error) {
            next(error)
        }
    },

    getRefreshToken: async (req, res, next) => {
        try {
            const {error, data} = await getRefreshToken(req.params.userName)
            if (error) {
                return throwError(404, error, res)
            }
            return res.json({
                status: `Loading refresh token of user ${req.params.userName} from Redis is successful!`,
                data: data,
            })
        } catch (error) {
            next(error)
        }
    },

    deleteRefreshToken: async (req, res, next) => {
        try {
            const {error, data} = await deleteRefreshToken(req.params.userName)
            if (error) {
                return throwError(404, error, res)
            } else {
                return res.json({
                    status: `Delete refresh token is successful!`,
                    data: data,
                })
            }
        } catch (error) {
            next(error)
        }
    },
})
