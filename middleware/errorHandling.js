const logger = require('../server/logger');
module.exports = function(err, req, res, next) {
    logger.debug(err);
    res.status(500).render('500', 
    {
        pageTitle: '500 Page',
        isSignedIn: req.user ? true : false,
    });
}