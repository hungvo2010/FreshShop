const authModel = require('../models/Auth');
const crypto = require("crypto");

const Email = require('../util/Email');
const getRootUrl = require('../util/getRootUrl');
const createJWTToken = require('../util/createJWTToken');

const { validationResult } = require('express-validator/check');

function validateRequestBody(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const msg = errors.array()[0].msg;
        res.status(422).json({message: msg});
        return false;
    }
    return true;
}

function attachToken(args) {
    const {req, res, token} = args;
    res.setHeader('Authorization', 'Bearer ' + token);
    res.cookie('jwt', token, {
        maxAge: 12 * 3600 * 1000,
        httpOnly: true,
        secure: req.secure || req.header('x-forwarded-proto') === 'https'
    });
}

exports.getSignin = (req, res, next) => {
    res.render('auth/signin', {
        pageTitle: 'Sign In',
    })
}

exports.postLogin = async (req, res, next) => {
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }

    try {
        const fetchUser = await authModel.authenUser(req.body);

        if (!fetchUser){
            return res.status(401).json({message: "Your email or your password is incorrect"});
        }

        const jwtToken = createJWTToken(fetchUser);
        attachToken({req, res, token: jwtToken});
        res.status(200).json({});
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
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }

    try {
        const newUser = await authModel.createUser(req.body);
        if (!newUser) {
            return res.status(409).json({message: "This email address is already being used"});
        }
        await new Email().sendEmailWelcome(req.body.email);
        res.status(201).json({});
    }
    
    catch (err) {
        return next(err);
    }
}

exports.getUpdatePassword = async (req, res, next) => {
    try {
        res.render('auth/update-password', {
            pageTitle: 'Update password',
        })
    }
    
    catch (err){
        next(err);
    }
}

exports.postUpdatePassword = async (req, res, next) => {
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }
    
    try {
        const user = await authModel.updatePassword({id: req.user.id, ...req.body});
        if (!user){
            return res.status(404).json({message: "Your current password is incorrect"});
        }
        return res.status(204).json({});
    }

    catch (err) {
        next(err);
    }
}

exports.getUpdateProfile = async (req, res, next) => {
    try {
        const user = await authModel.findUser(req.user.id);
        res.render('auth/update-profile', {
            user,
            pageTitle: 'Update profile',
        })
    }
    
    catch (err){
        next(err);
    }
}

exports.postUpdateProfile = async (req, res, next) => {
    const isValid = validateRequestBody(req, res);
    if (!isValid){
        return;
    }
    
    try {
        const user = await authModel.updateProfile({id: req.user.id, ...req.body});
        if (!user){
            return res.status(404).json({message: "Your information is invalid"});
        }
        return res.status(204).json({});
    }

    catch (err) {
        next(err);
    }
}

exports.getLogout = (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: req.secure || req.header('x-forwarded-proto') === 'https'
    });
    res.redirect('/');
}

exports.getReset = (req, res, next) => {
    try {
        res.render('auth/reset', {
            pageTitle: 'Reset Password',
        })
    }

    catch (err){
        next(err);
    }
}

exports.postReset = async (req, res, next) => {
    try {
        const isValid = validateRequestBody(req, res);
        if (!isValid){
            return;
        }

        const { email } = req.body;
        const user = await authModel.findUser(email);
        if (!user){
            return res.status(404).json({message: "No account associated with the email address"});
        }

        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                return next(err);
            }

            const token = buffer.toString("hex");
            try {
                authModel.saveToken(token, user.id);
            }

            catch (err) {
                return next(err);
            }
            await new Email().sendPasswordReset(email, token);
            res.status(200).json({});
        })
    }

    catch (err) {
        return next(err);
    }
}

exports.getNewPassword = async (req, res, next) => {
    const { token } = req.query;

    try {
        const existToken = await authModel.findToken(token);
        res.render('auth/new-password', {
            pageTitle: 'Choose new password',
            isValid: existToken ? true : false,
            resetToken: existToken ? token : '',
            tokenValidStatus: existToken ? '' : 'Your request is not recognized or already expired',           
        })
    }

    catch (err) {
        return next(err);
    }
}

exports.postNewPassword = async (req, res, next) => {
    const { newpassword, resetToken } = req.body;

    try {
        const existToken = await authModel.findToken(resetToken);

        if (!existToken){
            return res.status(404).json({message: 'Your request is not recognized or already expired'});
        }

        await authModel.deleteToken(existToken.userId);
        await authModel.setNewPassword({"id": existToken.userId, newpassword});
        return res.status(204).json({});
    }   
    
    catch (err){
        return next(err);
    }
}