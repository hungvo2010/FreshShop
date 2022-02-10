const User = require("../models/user");
const Token = require("../models/token");
const path = require("path");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const emailTransporter = require('../util/emailTransporter');
const { validationResult } = require('express-validator/check');

require('dotenv').config({path: path.join(__dirname, '.env')});

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        oldInput: {},
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email,
                password,
            },
        })
    }

    User.findOne({
        where: {
            email,
        }
    })
    .then(user => {
        if (!user){ // user with this email not found
            req.flash('error', 'Invalid user or password');
            return res.redirect('/login');
        }
        bcryptjs.compare(password, user.password)
        .then(result => {
            if (result) { // matching password => login successfully
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    res.redirect('/');
                })
            }
            req.flash('error', 'Invalid user or password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Some error occurred, please try again later');
            res.redirect('/login');
        })
    })
    .catch(err => {
        console.log(err);
        req.flash('error', 'Some error occurred, please try again later');
        res.redirect('/login');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        oldInput: {}
    })
}

exports.postSignup = (req, res, nexy) => {
    const email = req.body.email;
    const password = req.body.password;
    const retypepassword = req.body.retypepassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email,
                password,
                retypepassword
            }
        })
    }

    User.findOne({
        where: {
            email: email,
        }
    })
    .then(user => {
        if (user) {
            req.flash('error', 'Email exists');
            return res.redirect('/signup');
        }
        return bcryptjs.hash(password, 12)
        .then(hashedPassword => {
            return User.create({
                email,
                password: hashedPassword,
            })
        })
        .then(user => {
            res.redirect('/login');
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: 'Sign Up Successfully',
                text: 'Hello! Welcome you to my page',
            };
            emailTransporter.sendMail(mailOptions, (err, response) => {
                err ? console.log(err) : console.log(response);
                emailTransporter.close();
            })
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Some error occurred, please try again later');
            return res.redirect('/signup');
        })
    })
    .catch(err => {
        console.log(err);
        req.flash('error', 'Some error occurred, please try again later');
        return res.redirect('/signup');
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    })
}

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    User.findOne({
        where: {
            email,
        }
    })
    .then(user => {
        if (!user){
            req.flash('error', 'No account with your email found!');
            return res.redirect('/reset');
        }
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Some errors occurred, please try again later!');
                return res.redirect('/reset');
            }
            req.flash('error', 'Check your inbox to reset your password.');
            res.redirect('/login');
            const token = buffer.toString("hex");
            Token.findOne({
                where: {
                    userId: user.id,
                }
            })
            .then(existToken => {
                if (!existToken){
                    return Token.create({
                        userId: user.id,
                        token,
                    })
                }
                existToken.token = token;
                return existToken.save();
            })
            .catch(err => {
                console.log(err);
                return next(new Error(err));
            })
            const emailOptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: 'RESET PASSWORD',
                html: `<p>Click this <a href='${process.env.BASE_URL}reset/${token}'>link</a> to reset your password.</p>`
            };
            emailTransporter.sendMail(emailOptions, (err, response) => {
                err ? console.log(err) : console.log(response);
                emailTransporter.close();
            })
        })
    })
}

exports.getResetPassword = (req, res, next) => {
    const resetToken = req.params.resetToken;
    Token.findOne({
        where: {
            token: resetToken,
            expirationDate: {
                [Op.gt]: Date.now()
            }
        }
    })
    .then(existToken => {
        if (!existToken){
            req.flash('error', 'Your request is not recognized or already expired');
            return res.redirect('/login');
        }
        res.render('auth/new-password', {
            path: '/new-password',
            pageTitle: 'New Password',
            resetToken,
            userId: existToken.userId,            
        })
    })
    .catch(err => {
        console.log(err);
        return next(new Error(err));
    })
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    const password = req.body.password;
    Token.findOne({
        where: {
            token: resetToken,
            userId,
            expirationDate: {
                [Op.gt]: Date.now()
            }
        }
    })
    .then(existToken => {
        if (!existToken){
            req.flash('error', 'Your request is not recognized or already expired');
            return res.redirect('/login');
        }
        return existToken.destroy();
    })
    .then(result => {
        return User.findByPk(userId);
    })
    .then(user => {
        return bcryptjs.hash(password, 12).then(hashedPassword => {
            user.password = hashedPassword;
            user.save();
        })
        .catch(err => {
            console.log(err);
            return next(new Error(err));
        })
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
        return next(new Error(err));
    })
}