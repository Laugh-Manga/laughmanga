const authProviders = require('../../../configs/authProviders.config')

module.exports = (router) => {
    // authentication
    const authSocialMediaRouter = require('../helpers/authSocialMedia.helper')(
        router,
        {
            baseUrl: process.env.BASE_URL,
            providers: authProviders,
            successRedirect: '/getListUsers',
            failureRedirect: '/login',
        },
    )

    // auth.init() links in Passport middleware:
    authSocialMediaRouter.init()

    // now we can specify our auth routes:
    authSocialMediaRouter.registerRoutes()
}
