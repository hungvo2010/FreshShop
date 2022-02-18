const User = require('../models/user');

module.exports = async (req, res, next) => {
    if (!req.session.isLoggedIn){
        return next();
    }
    try {
        const user = await User.findOne({
            where: {
                id: req.session.user.id,
            }
        });
        if (!user) return next();
        req.user = user;
        try {
            await user.createCart();
            next();
        }
        catch (err){
            console.log(err);
            return next(new Error(err));
        }
    }
    catch (err){
        console.log(err);
        return next(new Error(err));
    }
}