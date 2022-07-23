const userModel = require('../models/user.model')
const passport = require('passport')
const facebookStrategy = require('passport-facebook').Strategy
const googleStrategy = require('passport-google-oauth').OAuth2Strategy
const githubStrategy = require('passport-github2').Strategy

const {signAccessToken, signRefreshToken} = require('../services/jwt.service')

module.exports = (app, options) => {
    // if success and failure redirects aren't specified,
    // set some reasonable defaults
    if (!options.successRedirect) {
        options.successRedirect = '/getListUsers'
    }

    if (!options.failureRedirect) {
        options.failureRedirect = '/login'
    }

    return {
        init: () => {
            const config = options.providers

            // configure Facebook strategy
            passport.use(
                new facebookStrategy(
                    {
                        clientID: config.facebook.clientID,
                        clientSecret: config.facebook.clientSecret,
                        callbackURL:
                            (options.baseUrl || '') + '/auth/facebook/callback',
                    },
                    (accessToken, refeshToken, profile, done) => {
                        const userName = 'facebook' + profile.id
                        userModel.findOne({userName}, (err, userOject) => {
                            if (err) return done(err, null)
                            if (userOject) return done(null, userOject)
                            userOject = new userModel({
                                userName,
                                showName: profile.displayName,
                            })
                            userOject.save((err) => {
                                if (err) return done(err, null)
                                done(null, userOject)
                            })
                        })
                    },
                ),
            )

            // configure Google OAuth2 strategy
            passport.use(
                new googleStrategy(
                    {
                        clientID: config.google.clientID,
                        clientSecret: config.google.clientSecret,
                        callbackURL:
                            (options.baseUrl || '') + '/auth/google/callback',
                    },
                    (accessToken, refeshToken, profile, done) => {
                        const userName = 'google' + profile.id
                        userModel.findOne({userName}, (err, userOject) => {
                            if (err) return done(err, null)
                            if (userOject) return done(null, userOject)
                            userOject = new userModel({
                                userName,
                                showName: profile.displayName,
                            })
                            userOject.save((err) => {
                                if (err) return done(err, null)
                                done(null, userOject)
                            })
                        })
                    },
                ),
            )

            // configure Github OAuth2 strategy
            passport.use(
                new githubStrategy(
                    {
                        clientID: config.github.clientID,
                        clientSecret: config.github.clientSecret,
                        callbackURL:
                            (options.baseUrl || '') + '/auth/github/callback',
                    },
                    (accessToken, refeshToken, profile, done) => {
                        const userName = 'github' + profile.id
                        userModel.findOne({userName}, (err, userOject) => {
                            if (err) return done(err, null)
                            if (userOject) return done(null, userOject)
                            userOject = new userModel({
                                userName,
                                showName: profile.username,
                            })
                            userOject.save((err) => {
                                if (err) return done(err, null)
                                done(null, userOject)
                            })
                        })
                    },
                ),
            )
        },

        registerRoutes: () => {
            // register Facebook routes
            app.get('/auth/facebook', function (req, res, next) {
                passport.authenticate('facebook')(req, res, next)
            })
            app.get(
                '/auth/facebook/callback',
                passport.authenticate('facebook', {
                    failureRedirect: options.failureRedirect,
                    session: false,
                }),
                async function (req, res) {
                    const {password, ...others} = req.user._doc
                    const accessToken = await signAccessToken(others)
                    const refreshToken = await signRefreshToken(others)
                    // we only get here on successful authentication
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 365 * 24 * 60 * 60 * 1000,
                    }).json({
                        status: 'Account is logined successfully!',
                        data: {
                            ...others,
                            accessToken,
                        },
                    })
                },
            )

            // register Google routes
            app.get('/auth/google', function (req, res, next) {
                passport.authenticate('google', {scope: 'profile'})(
                    req,
                    res,
                    next,
                )
            })
            app.get(
                '/auth/google/callback',
                passport.authenticate('google', {
                    failureRedirect: options.failureRedirect,
                    session: false,
                }),
                async function (req, res) {
                    const {password, ...others} = req.user._doc
                    const accessToken = await signAccessToken(others)
                    const refreshToken = await signRefreshToken(others)
                    // we only get here on successful authentication
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 365 * 24 * 60 * 60 * 1000,
                    }).json({
                        status: 'Account is logined successfully!',
                        data: {
                            ...others,
                            accessToken,
                        },
                    })
                },
            )

            // register Github routes
            app.get('/auth/github', function (req, res, next) {
                passport.authenticate('github', {scope: 'profile'})(
                    req,
                    res,
                    next,
                )
            })
            app.get(
                '/auth/github/callback',
                passport.authenticate('github', {
                    failureRedirect: options.failureRedirect,
                    session: false,
                }),
                async function (req, res) {
                    const {password, ...others} = req.user._doc
                    const accessToken = await signAccessToken(others)
                    const refreshToken = await signRefreshToken(others)
                    // we only get here on successful authentication
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 365 * 24 * 60 * 60 * 1000,
                    }).json({
                        status: 'Account is logined successfully!',
                        data: {
                            ...others,
                            accessToken,
                        },
                    })
                },
            )
        },
    }
}
