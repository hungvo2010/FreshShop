const authModel = require('../models/Auth');
const crypto = require("crypto");

const Email = require('../util/Email');
const getRootUrl = require('../util/getRootUrl');
const createJWTToken = require('../util/createJWTToken');

const { validationResult } = require('express-validator/check');

const attachToken = args => {
    const {res, token} = args;
    res.setHeader('Authorization', 'Bearer ' + token);
}

exports.getSignin = (req, res, next) => {
    res.render('auth/signin', {
        pageTitle: 'Sign In',
    })
}

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.render('auth/signin', {
            pageTitle: 'Sign In',
        })
    }

    try {
        const fetchUser = await authModel.authenUser(req.body);

        if (!fetchUser){
            return res.redirect('/login');
        }

        const jwtToken = createJWTToken(fetchUser);
        attachToken({res, token: jwtToken});
        res.redirect('/');
    } 
    
    catch(err) {
        next(err);
    }
}

exports.getSignup = (req, res, next) => {
    
    res.render('auth/signup', {
        pageTitle: 'Sign Up',
    })
}

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.render('auth/signup', {
            pageTitle: 'Sign Up',
        })
    }

    try {
        const newUser = await authModel.createUser(req.body);
        if (!newUser) {
            return res.redirect('/signup');
        }

        res.redirect('/login');
        // new Email(newUser.email).send('<p>Hello! Welcome you to my page</p>', 'Sign Up Successfully');
    }
    
    catch (err) {
        return next(err);
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    })
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    })
}

exports.postReset = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await authModel.findUser(email);

        if (!user){
            req.flash('error', 'No account with your email found!');
            return res.redirect('/reset');
        }

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return next(err);
            }

            req.flash('error', 'Check your inbox to reset password.');
            res.redirect('/login');

            const token = buffer.toString("hex");
            try {
                authModel.saveToken(token, user.id);
            }

            catch (err) {
                return next(err);
            }
            new Email(email).sendPasswordReset(`<p>Click this <a href='${getRootUrl()}reset/${token}'>link</a> to reset your password.</p>`);
        })
    }

    catch (err) {
        return next(err);
    }
}

exports.getResetPassword = async (req, res, next) => {
    const { resetToken } = req.params;

    try {
        const existToken = await authModel.findToken(resetToken);

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
        return next(err);
    }
}

exports.postNewPassword = async (req, res, next) => {
    const {userId, resetToken, password} = req.body;

    try {
        const existToken = await authModel.findToken(resetToken);

        if (!existToken){
            req.flash('error', 'Your request is not recognized or already expired');
            return res.redirect('/login');
        }

        authModel.deleteToken(+userId);
        const user = await authModel.findUser(+userId);
        await authModel.upsertUser({"id": +userId, "email": user.email, password});
        res.redirect('/login');
    }   
    
    catch (err){
        return next(err);
    }
}