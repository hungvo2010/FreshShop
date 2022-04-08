const sellerRoutes = require('../routes/sellerRoute');
const shopRoutes = require('../routes/shopRoute');
const authRoutes = require('../routes/authRoute');

module.exports = app => {
    app.use(authRoutes);
    app.use('/seller', sellerRoutes);
    app.use(shopRoutes);
}