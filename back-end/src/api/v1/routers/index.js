const express = require('express')
const api = express.Router()
const userRouter = require('./user.router')
const adminRouter = require('./admin.router')
const authSocialMediaRouter = require('./authSocialMedia.router')

api.get('/', (req, res, next) => {
    res.send(
        'Welcome to API page! \nGo to back-end/src/api/v1/controllers/tests/routers.test.http to experience Auth future!',
    )
})

userRouter(api)
authSocialMediaRouter(api)
adminRouter(api)

module.exports = api
