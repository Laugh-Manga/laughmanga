const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const generateOTP = require('../helpers/OTP.helpers')

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
    },
    showName: {
        type: String,
    },
    role: {
        type: Boolean,
        default: false,
    },
})

// [middleware] before save in Database
userSchema.pre('save', async function (next) {
    try {
        // hash password
        if (!this.password) this.password = generateOTP()
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds)
        const hashPassword = bcrypt.hashSync(this.password, salt)
        this.password = hashPassword

        // add showName field
        if (!this.showName) this.showName = this.get('userName')
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.checkPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        next(error)
    }
}

const userModel = mongoose.model('userModel', userSchema)
module.exports = userModel
