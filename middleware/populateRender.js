module.exports = (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; // set this properties for all render function
    res.locals.csrfToken = req.csrfToken();
    next();
}