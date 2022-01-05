const express = require('express');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');

const authController = require('../controllers/auth');

const router = express.Router();

// /login => GET
router.get('/login', authController.getLogin);

// /login => POST
router.post('/login', authController.postLogin);

// /signup => GET,
router.get('/signup', authController.getSignup);

// /signup => POST,
router.post('/signup', authController.postSignup);

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
