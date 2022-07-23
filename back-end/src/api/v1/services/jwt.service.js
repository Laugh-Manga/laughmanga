const JWT = require('jsonwebtoken')
const {
    redis,
    delCache,
    getAllKeys,
} = require('../helpers/connectToRedis.helper')

const signAccessToken = (dataUser) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userName: dataUser.userName,
            role: dataUser.role,
        }

        const secretKey = process.env.ACCESS_TOKEN_SECRET

        const option = {
            expiresIn: '1h',
        }
        JWT.sign(payload, secretKey, option, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const signRefreshToken = (dataUser) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userName: dataUser.userName,
            role: dataUser.role,
        }

        const secretKey = process.env.REFRESH_TOKEN_SECRET

        const option = {
            expiresIn: '1y',
        }
        JWT.sign(payload, secretKey, option, (err, token) => {
            if (err) reject(err)
            redis.set(
                payload.userName,
                token,
                'EX',
                365 * 24 * 60 * 60,
                (err, reply) => {
                    if (err) reject(err)
                    resolve(token)
                },
            )
        })
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken,
}
