const authModel = require('../models/Auth');

module.exports = async (req, res, next) => {
    if (req.session && !req.session.isLoggedIn){
        return next();
    }
    
    try {
        const user = await authModel.findUser(req.session.user.id);
        if (!user) return next();
        req.user = user;
    }
    
    catch (err){
        console.log(err);
        return next(new Error(err));
    }
}