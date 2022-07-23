const JWT = require('jsonwebtoken')

// Helpers
const throwError = require('../helpers/throwError.hepler')
const {redis} = require('../helpers/connectToRedis.helper')

var that = (module.exports = {
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) {
            return throwError(
                401,
                "Unauthorized: Don't have authorization in headers",
                res,
            )
        }

        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return throwError(401, err.message, res)
            }
            req.payload = payload
            next()
        })
    },

    verifyRefreshToken: (req, res, next) => {
        if (!req.cookies.refreshToken) {
            return throwError(
                400,
                "Bad Request: Don't have refreshToken in request cookie",
                res,
            )
        }
        const token = req.cookies.refreshToken

        JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return throwError(401, err.message, res)
            }
            redis.get(payload.userName, (err, reply) => {
                if (err) {
                    return throwError(500, 'Server Error!', res)
                } else if (token === reply) {
                    req.payload = payload
                    return next()
                } else {
                    return throwError(
                        401,
                        'This Refresh Token is invalid (expire or in blackist) !',
                        res,
                    )
                }
            })
        })
    },
})
