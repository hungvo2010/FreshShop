const logger = require('../server/logger');

module.exports = function(err, req, res, next) {
    logger.debug(err);
    const statusCode = err.status || 500;
    const message = err.message || "Some errors occurred, please try again later.";
    if (req.method == 'GET')
    {
        res.render('error/500', 
        {
            pageTitle: '500 Page',
            isSignedIn: req.user ? true : false,
        });
    }
    
    else {
        res.status(statusCode).json({message: message});
    }
}