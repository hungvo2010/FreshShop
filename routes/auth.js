const express = require('express');
const { check } = require('express-validator/check');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

// /login => GET
router.get('/signin', authController.getSignin);

// /login => POST
router.post('/signin', [
    body('email').isEmail().withMessage('Your email is in invalid format'),
    body('password').trim().not().isEmpty().withMessage('Your password is empty')
], authController.postLogin);

// /signup => GET,
router.get('/signup', authController.getSignup);

// /signup => POST,
router.post('/signup', [
    check('email').isEmail().withMessage('Your email is in invalid format'),
    check('password').trim().isLength({min: 6}).withMessage('Your password is too short'),
    check('confirmpassword').trim().custom((value, {req}) => {
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
