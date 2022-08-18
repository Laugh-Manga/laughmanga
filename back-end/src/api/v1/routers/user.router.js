const {
    register,
    refreshToken,
    login,
    logout,
    getListUsers,
    forgotPassword,
} = require('../controllers/user.controller')

const {
    verifyAccessToken,
    verifyRefreshToken,
} = require('../middlewares/verifyToken.middleware')

module.exports = (router) => {
    router.post('/register', register)

    router.post('/refesh-token', verifyRefreshToken, refreshToken)

    router.post('/login', login)

    router.delete('/logout', verifyRefreshToken, logout)

    router.get('/get-list-users', verifyAccessToken, getListUsers)

    router.put('/forgot-password', forgotPassword)
}
