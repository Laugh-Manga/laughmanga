const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')

// Connect to MongoBD
const connectMongoBD = mongoose
    .connect(process.env.MONGODB_URL)
    .then((result) => {
        console.log('Connect to MongoDB successfully!')
    })
    .catch((err) => {
        console.error('Connect to MongoDB failed!', err)
    })

module.exports = connectMongoBD
