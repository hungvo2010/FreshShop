const protectRoutes = (req, res, next) => {
    if (!req.session.isSignedIn){
        return res.redirect('/signin');
    }
    next();
}

module.exports = protectRoutes;