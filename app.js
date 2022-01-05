const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const app = express();

const csrfProtection = csrf();

const mysqlStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'session',
})

const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');
const User = require('./models/user');

Product.belongsTo(User); // foreign key place in SOURCE models 1:1 relationship
User.hasMany(Product); // foreign key place in TARGET model, 1:n relationship
User.hasOne(Cart); // 1:1 TARGET models
User.hasMany(Order); // 1:n
Order.belongsTo(User); // n:1
Product.belongsToMany(Order, {through: OrderItem}); // m:n relationship
Order.belongsToMany(Product, {through: OrderItem}); // m:n relationship
Product.belongsToMany(Cart, {through: CartItem}); // m:n relationship
Cart.belongsToMany(Product, {through: CartItem}); // m:n relationship

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //update session in db only when some change is maked
    saveUninitialized: false, //save session in db only when some data is initialized
    store: mysqlStore,
}))

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; // set this properties for all render function
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.isLoggedIn){
        return next();
    }
    User.findOne({
        where: {
            id: req.session.user.id,
        }
    })
    .then(user => {
        if (!user) return next();
        req.user = user;
        return req.user.createCart()
        .then(result => {
            next();
        });
    })
    .catch(err => {
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

sequelize.sync()
.then(db => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})
