const {
    addUser,
    getListUsers,
    updateUser,
    deleteUser,
    getUser,
    getListRefreshTokens,
    getRefreshToken,
    deleteRefreshToken,
} = require('../controllers/admin.controller')

const {verifyAccessToken} = require('../middlewares/verifyToken.middleware')

const {isAdmin} = require('../middlewares/isAdmin.middleware')

module.exports = (router) => {
    router.post('/admin/add-user', verifyAccessToken, isAdmin, addUser)

    router.get('/admin/users', verifyAccessToken, isAdmin, getListUsers)

    router.get('/admin/users/:id', verifyAccessToken, isAdmin, getUser)

    router.put('/admin/users/:id', verifyAccessToken, isAdmin, updateUser)

    router.delete('/admin/users/:id', verifyAccessToken, isAdmin, deleteUser)

    router.get(
        '/admin/refresh-tokens',
        verifyAccessToken,
        isAdmin,
        getListRefreshTokens,
    )

    router.get(
        '/admin/refresh-tokens/:userName',
        verifyAccessToken,
        isAdmin,
        getRefreshToken,
    )

    router.delete(
        '/admin/refresh-tokens/:userName',
        verifyAccessToken,
        isAdmin,
        deleteRefreshToken,
    )
}
