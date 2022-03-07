module.exports = (req, res, next) => {
    res.locals.isSignedIn = req.session.isSignedIn; // set this properties for all render function
    res.locals.csrfToken = req.csrfToken();
    next();
}