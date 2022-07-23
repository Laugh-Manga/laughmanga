const express = require('express')
const app = express()
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const api = require('./src/api/v1/routers/index')
const cors = require('cors')
const throwError = require('./src/api/v1/helpers/throwError.hepler')
const https = require('https')
const options = require('./src/configs/ssl.config')
const cookieParser = require('cookie-parser')

// Connect to MongoBD
require('./src/api/v1/helpers/connectToMongoBD.helper')

dotenv.config()
app.set('port', process.env.PORT || 8000)

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use(helmet())
app.use(morgan('dev'))

// API Homepage
app.get('/', (req, res, next) => {
    res.send(
        'Welcome to LaughManga project! Access to https://localhost:' +
            process.env.PORT +
            '/api/v1 to explore! Have fun!',
    )
})

// API Homepage
app.use('/api/v1', api)

// Catch error 404 and 500
app.use((req, res, next) => {
    throwError(404, "This page isn't found!", res)
})

app.use((err, req, res, next) => {
    throwError(500, 'Server Error!', res, err)
})

// Run server
https.createServer(options, app).listen(app.get('port'), function () {
    console.log(
        'Express started on https://localhost:' +
            app.get('port') +
            '; press Ctrl-C to terminate',
    )
})
