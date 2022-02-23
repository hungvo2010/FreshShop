const User = require("../models/user");
const Token = require("../models/token");
const path = require("path");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const Email = require('../util/Email');
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

exports.postLogin = async (req, res, next) => {
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

    try {
        const user = await User.findOne({
            where: {
                email,
            }
        })
        if (!user){ // user with this email not found
            req.flash('error', 'Invalid user or password');
            return res.redirect('/login');
        }
        try {
            const result = await bcryptjs.compare(password, user.password);
            if (result) { // matching password => login successfully
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    res.redirect('/');
                })
            }
            req.flash('error', 'Invalid user or password');
            res.redirect('/login');
        }
        catch (err) {
                console.log(err);
                req.flash('error', 'Some error occurred, please try again later');
                res.redirect('/login');
            }
    } catch(err) {
        console.log(err);
        req.flash('error', 'Some error occurred, please try again later');
        res.redirect('/login');
    }
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

exports.postSignup = async (req, res, nexy) => {
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
    try {
        const user = await User.findOne({
            where: {
                email: email,
            }
        })
        if (user) {
            req.flash('error', 'Email exists');
            return res.redirect('/signup');
        }
        try {
            const hashedPassword = await bcryptjs.hash(password, 12);
            await User.create({
                email,
                password: hashedPassword,
            })
            res.redirect('/login');
            new Email(email).send('<p>Hello! Welcome you to my page</p>', 'Sign Up Successfully');
        }
            
        catch (err) {
            console.log(err);
            req.flash('error', 'Some error occurred, please try again later');
            return res.redirect('/signup');
        }
    }
    catch (err) {
        console.log(err);
        req.flash('error', 'Some error occurred, please try again later');
        return res.redirect('/signup');
    }
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

exports.postReset = async (req, res, next) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({
            where: {
                email,
            }
        })
        if (!user){
            req.flash('error', 'No account with your email found!');
            return res.redirect('/reset');
        }
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Some errors occurred, please try again later!');
                return res.redirect('/reset');
            }
            req.flash('error', 'Check your inbox to reset password.');
            res.redirect('/login');
            const token = buffer.toString("hex");
            try {
                const existToken = await Token.findOne({
                    where: {
                        userId: user.id,
                    }
                })
                if (!existToken){
                    return Token.create({
                        userId: user.id,
                        token,
                    })
                }
                existToken.token = token;
                existToken.save();
            }
            catch (err) {
                console.log(err);
                return next(new Error(err));
            }
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
}
    catch (err) {
        console.log(err);
        return next(new Error(err));
    }
}

exports.getResetPassword = async (req, res, next) => {
    const resetToken = req.params.resetToken;
    try {
        const existToken = await Token.findOne({
            where: {
                token: resetToken,
                expirationDate: {
                    [Op.gt]: Date.now()
                }
            }
        })
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
    }
    catch (err) {
        console.log(err);
        return next(new Error(err));
    }
}

exports.postNewPassword = async (req, res, next) => {
    const userId = req.body.userId;
    const resetToken = req.body.resetToken;
    const password = req.body.password;
    try {
        const existToken = await Token.findOne({
            where: {
                token: resetToken,
                userId,
                expirationDate: {
                    [Op.gt]: Date.now()
                }
            }
        });
        if (!existToken){
            req.flash('error', 'Your request is not recognized or already expired');
            return res.redirect('/login');
        }
        existToken.destroy();
        const user = await User.findByPk(userId);
        try {
            const hashedPassword = await bcryptjs.hash(password, 12);
            user.password = hashedPassword;
            await user.save();
            res.redirect('/login');
        }
        catch (err) {
            console.log(err);
            return next(new Error(err));
        }
    }   
    catch (err){
        console.log(err);
        return next(new Error(err));
    }
}