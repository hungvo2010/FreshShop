const express = require('express');
const { check } = require('express-validator/check');
const { body } = require('express-validator/check');

const protectRoutes = require('../middleware/protectRoutes');
const authController = require('../controllers/auth');

const router = express.Router();

// /login => GET
router.get('/signin', authController.getSignin);

// /login => POST
router.post('/signin', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').trim().not().isEmpty().withMessage('Please enter your password')
], authController.postLogin);

// /signup => GET,
router.get('/signup', authController.getSignup);

// /signup => POST,
router.post('/signup', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').trim().isLength({min: 6}).withMessage('Your password must be at least 6 characters'),
    check('confirmpassword').trim().custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error("Confirm password doesn't match");
        }
        return true;
    })
], authController.postSignup);

// /update-profile => GET
router.get('/update-profile', protectRoutes, authController.getUpdateProfile);

// /update-password => GET
router.get('/update-password', protectRoutes, authController.getUpdatePassword);

// /profile => POST
router.post('/profile', protectRoutes, [
    check('name').not().isEmpty().withMessage('Please enter your username'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('mobile').isMobilePhone().withMessage('Invalid mobile phone number'),
], authController.postUpdateProfile);

// /password => POST
router.post('/password', protectRoutes, [
    check('oldpassword').trim().isLength({min: 6}).withMessage('Your old password must be at least 6 characters'),
    check('newpassword').trim().isLength({min: 6}).withMessage('Your confirm password must be at least 6 characters'),
    check('confirmpassword').trim().custom((value, {req}) => {
        if (value !== req.body.newpassword){
            throw new Error("Confirm password doesn't match");
        }
        return true;
    })
], authController.postUpdatePassword);

// /logout => GET
router.get('/logout', protectRoutes, authController.getLogout);

// /reset => GET
router.get('/reset-password', authController.getReset);

// /reset => POST
router.post('/reset', [
    check("email").isEmail().withMessage("Invalid email address"),
], authController.postReset);

// /users/reset?token= => GET
router.get('/users/reset', authController.getResetPassword);

// /reset/new-password => POST
router.post('/users/new', [
    check('newpassword').trim().isLength({min: 6}).withMessage('Your confirm password must be at least 6 characters'),
    check('confirmpassword').trim().custom((value, {req}) => {
        if (value !== req.body.newpassword){
            throw new Error("Confirm password doesn't match");
        }
        return true;
    })
], authController.postNewPassword);

module.exports = router;
