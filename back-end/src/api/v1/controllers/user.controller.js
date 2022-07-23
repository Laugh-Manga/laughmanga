'use strict'

// Services
const {
    register,
    refreshToken,
    login,
    logout,
    getListUsers,
} = require('../services/user.sevice')

// Helper
const throwError = require('../helpers/throwError.hepler')

var that = (module.exports = {
    register: async (req, res, next) => {
        try {
            const {error, data} = await register(req.body)

            if (error) {
                return throwError(400, error, res)
            }

            if (data.userNameIsExit) {
                return throwError(
                    409,
                    `${data.userNameIsExit} has been registered!`,
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

    refreshToken: async (req, res, next) => {
        try {
            const {error, data} = await refreshToken(req.payload)
            if (error) {
                return throwError(404, error, res)
            }
            const {rewRefreshToken, ...others} = data
            return res
                .cookie('refreshToken', rewRefreshToken, {
                    domain: 'localhost:8080',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                })
                .json({
                    status: 'Access Token and Refesh Token are re-created successfully!',
                    data: others,
                })
        } catch (error) {
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            const {error, data} = await login(req.body)
            if (data) {
                const {refreshToken, ...others} = data
                return res
                    .cookie('refreshToken', refreshToken, {
                        domain: 'localhost:8080',
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 365 * 24 * 60 * 60 * 1000,
                    })
                    .json({
                        status: 'Account is logined successfully!',
                        data: others,
                    })
            }
            if (error.errorValidate) {
                return throwError(400, error.errorValidate, res)
            }
            if (error.errorUnauthorized) {
                return throwError(
                    401,
                    `${error.errorUnauthorized} isn't registered`,
                    res,
                )
            }
            return throwError(401, 'Password is wrong!', res)
        } catch (error) {
            next(error)
        }
    },

    logout: async (req, res, next) => {
        try {
            const {error, data} = await logout(req.payload)
            if (error) {
                return throwError(404, error, res)
            }
            return res.json({
                status: 'Logout is successful!',
                data: data,
            })
        } catch (error) {
            next(error)
        }
    },

    getListUsers: async (req, res, next) => {
        try {
            const {error, data} = await getListUsers(req.payload)
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
})
