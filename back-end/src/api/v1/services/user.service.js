'use strict'

const bcrypt = require('bcrypt')

// Models
const userModel = require('../models/user.model')

// Validations
const {
    userValidate,
    emailValidate,
    resetValidate,
} = require('../validations/user.validation')

// Services
const {signAccessToken, signRefreshToken} = require('./jwt.service')

// Helpers
const {redis} = require('../helpers/connectToRedis.helper')
const {sendMail} = require('../helpers/mailer.helper')

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

        const isExist = await userModel.findOne({
            userName: value.userName,
        })

        if (!isExist) {
            const newUserOject = await new userModel({
                userName: value.userName,
                password: value.password,
                email: value.email,
            })

            const savedUser = await newUserOject.save()

            const {password, ...others} = savedUser._doc
            return {
                error: null,
                data: {
                    userNameIsExit: null,
                    dataUser: others,
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
        let userMap = {}
        const userOjects = await userModel.find({})
        userOjects.forEach((userOject) => {
            const {password, ...others} = userOject._doc
            userMap[userOject._id] = others
        })
        return {
            error: null,
            data: userMap,
        }
    },

    forgotPassword: async (data) => {
        const size = Object.keys(data).length
        if (size === 1) {
            const {value, error} = emailValidate(data)

            if (error) {
                return {
                    error: {
                        validateError: error.details[0].message,
                        unauthorizedError: null,
                    },
                    data: {
                        emailData: null,
                        emailNotExit: false,
                    },
                }
            }

            const userOject = await userModel.findOne({email: value.email})
            if (!userOject) {
                return {
                    error: {
                        validateError: null,
                        unauthorizedError: null,
                    },
                    data: {
                        emailData: null,
                        emailNotExit: true,
                    },
                }
            }
            // Generate and set password reset token
            const generatePasswordReset =
                await userOject.generatePasswordReset()

            // Save the updated user oject
            const savedUser = await userOject.save().then((userOject) => {
                // send email
                const to = userOject.email
                const subject = 'Reset password'
                const htmlContent = `
                <p>
                We recently received a request to the password to your Laugh Manga account. Click 
                <a href="${process.env.APP_URL}/forgot-password?token=${userOject.resetPasswordToken}"> here</a>
                  to Reset your password 
                </p>
                <p>Note: 
                <i>case the you didn't initialize any password reset you can ignore the email and keep using the application normally with your current password</i>.
                </p>
                `

                sendMail(to, subject, htmlContent)
                console.log(
                    `${process.env.BASE_URL}/forgot-password?token=${userOject.resetPasswordToken}`,
                )
            })

            return {
                error: {
                    validateError: null,
                    unauthorizedError: null,
                },
                data: {
                    emailData: userOject.email,
                    emailNotExit: false,
                },
            }
        } else if (size === 2) {
            const {value, error} = resetValidate(data)

            if (error) {
                return {
                    error: {
                        validateError: error.details[0].message,
                        unauthorizedError: null,
                    },
                    data: {
                        emailData: null,
                        emailNotExit: false,
                    },
                }
            }

            const userOject = await userModel.findOne({
                resetPasswordToken: value.token,
                resetPasswordExprires: {$gt: Date.now()},
            })
            if (!userOject) {
                return {
                    error: {
                        validateError: null,
                        unauthorizedError:
                            'Password reset toekn is invalid or has expired!',
                    },
                    data: {
                        emailData: null,
                        emailNotExit: false,
                    },
                }
            }

            // Set the new password
            userOject.password = value.newPassword
            userOject.resetPasswordToken = undefined
            userOject.resetPasswordExprires = undefined

            const savedUser = await userOject.save().then((userOject) => {
                // send email
                const to = userOject.email
                const subject = 'Your password has been changed'
                const htmlContent = `
                <p>
                Hi ${userOject.showName},
                </p>
                <p>This is a confirmation that the password for your account ${userOject.userName} has been changed.
                </p>
                `

                sendMail(to, subject, htmlContent)
                console.log(
                    `The password for your account ${userOject.userName} has been changed`,
                )
            })
            return {
                error: {
                    validateError: null,
                    unauthorizedError: null,
                },
                data: {
                    emailData: null,
                    emailNotExit: false,
                    emailConfirm: true,
                },
            }
        } else {
            return {
                error: {
                    validateError: 'Request body is invalid!',
                    unauthorizedError: null,
                },
                data: {
                    emailData: null,
                    emailNotExit: null,
                },
            }
        }
    },
})
