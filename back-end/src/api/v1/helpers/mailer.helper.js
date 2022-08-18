const nodemailer = require('nodemailer')
const {mailServer, password} = require('../../../configs/email.config')

const sendMail = (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailServer,
            pass: password,
        },
    })
    const mainOptions = {
        from: mailServer,
        to: to,
        subject: subject,
        html: htmlContent,
    }
    return transporter.sendMail(mainOptions)
}

module.exports = {
    sendMail,
}
