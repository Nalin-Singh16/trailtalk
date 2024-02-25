const express = require('express')
const router = express.Router()
const catchAsync = require('../utilities/catchAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const userController = require('../controllers/users')

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync(userController.register))

router.route('/login')
    .get(userController.renderLogin)
    .post(
        // use the storeReturnTo middleware to save the returnTo value from session to res.locals
        storeReturnTo,
        // passport.authenticate logs the user in and clears req.session
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        // Now we can use res.locals.returnTo to redirect the user after login
        userController.login);

router.get('/logout', userController.logout);

module.exports = router