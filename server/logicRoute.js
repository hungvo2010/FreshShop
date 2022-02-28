const adminRoutes = require('../routes/admin');
const shopRoutes = require('../routes/shop');
const authRoutes = require('../routes/auth');

module.exports = app => {
    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(authRoutes);
}