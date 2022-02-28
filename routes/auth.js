const express = require('express');
const { check } = require('express-validator/check');
const { body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

// /login => GET
router.get('/login', authController.getLogin);

// /login => POST
router.post('/login', [
    body('email').isEmail().withMessage('Your email is in invalid format'),
    body('password').trim().not().isEmpty().withMessage('Your password is empty')
], authController.postLogin);

// /signup => GET,
router.get('/signup', authController.getSignup);

// /signup => POST,
router.post('/signup', [
    check('email').isEmail().withMessage('Your email is in invalid format'),
    check('password').trim().isLength({min: 3}).withMessage('Your password is too short'),
    check('retypepassword').trim().custom((value, {req}) => {
        if (value !== req.body.password){
            throw new Error('Your confirm password was not match.');
        }
        return true;
    })
], authController.postSignup);

// /logout => POST
router.post('/logout', authController.postLogout);

// /reset => GET
router.get('/reset', authController.getReset);

// /reset => POST
router.post('/reset', authController.postReset);

// /reset/resetPassword => GET
router.get('/reset/:resetToken', authController.getResetPassword);

// /reset/new-password => POST
router.post('/new-password', authController.postNewPassword);

module.exports = router;
