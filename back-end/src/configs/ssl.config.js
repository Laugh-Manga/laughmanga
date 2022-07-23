// Refer: https://zeropointdevelopment.com/how-to-get-https-working-in-windows-10-localhost-dev-environment/

fs = require('fs')
module.exports = {
    key: fs.readFileSync(__dirname + '/ssl/api.localhost.key'),
    cert: fs.readFileSync(__dirname + '/ssl/api.localhost.crt'),
}
