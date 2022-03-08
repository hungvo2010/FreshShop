module.exports = (req, res, next) => {
    res.locals.isSignedIn = req.user ? true : false; // set this properties for all render function
    // res.locals.csrfToken = req.csrfToken();
    next();
}