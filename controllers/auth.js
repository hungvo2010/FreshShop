const User = require("../models/user");
const bcryptjs = require("bcryptjs");

exports.getLogin = (req, res, next) => {
    let message = req.flash('errorLogin');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where: {
            email,
        }
    })
    .then(user => {
        if (!user){ // user with this email not found
            req.flash('errorLogin', 'Invalid user or password');
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
            req.flash('errorLogin', 'Invalid user or password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            req.flash('errorLogin', 'Some error occurred, please try again later');
            res.redirect('/login');
        })
    })
    .catch(err => {
        console.log(err);
        req.flash('errorLogin', 'Some error occurred, please try again later');
        res.redirect('/login');
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('errorSignup');
    message = message.length > 0 ? message[0] : null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
    })
}

exports.postSignup = (req, res, nexy) => {
    const email = req.body.email;
    const password = req.body.password;
    const retypepassword = req.body.retypepassword;
    User.findOne({
        where: {
            email: email,
        }
    })
    .then(user => {
        if (user) {
            req.flash('errorSignup', 'Email exists');
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
        })
        .catch(err => {
            console.log(err);
            req.flash('errorSignup', 'Some error occurred, please try again later');
            return res.redirect('/signup');
        })
    })
    .catch(err => {
        console.log(err);
        req.flash('errorSignup', 'Some error occurred, please try again later');
        return res.redirect('/signup');
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}