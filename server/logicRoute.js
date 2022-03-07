const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoutes = require('../routes/auth');

module.exports = app => {
    app.use(authRoutes);
    app.use('/admin', adminRoutes);
    app.use('/shop', shopRoutes);
}