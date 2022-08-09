const throwError = require('../helpers/throwError.hepler')

var that = (module.exports = {
    isAdmin: (req, res, next) => {
        if (!req.payload) {
            return throwError(404, "Can't find payload from request", res)
        }
        if (req.payload.role === true) next()
        else
            return throwError(
                403,
                'Only admin is allowed to access this resoure!',
                res,
            )
    },
})
