const createError = require('http-errors');
const protectRoutes = (req, res, next) => {
    if (!req.user){
        return next(createError(403, "Sorry, you can't perform this action"));
    }
    next();
}

module.exports = protectRoutes;