module.exports = function(err, req, res, next) {
    console.log(err);
    res.status(500).render('500', 
    {
        pageTitle: '500 Page',
        path: req.url,
        isAuthenticated: req.session.isLoggedIn || false
    });
}