const createError = require('http-errors');
const protectRoutes = (req, res, next) => {
    if (!req.user){
        return next(createError(403));
    }
}

module.exports = protectRoutes;