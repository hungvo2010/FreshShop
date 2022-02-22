const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const upload = require('./service/upload');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const attachUser = require('./middleware/attachUser');
const populateRender = require('./middleware/populateRender');
const errorHandling = require('./middleware/errorHandling');

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

app.use(logger('dev'));
app.use(upload.single('image'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //update session in db only when some change is maked
    saveUninitialized: false, //save session in db only when some data is initialized
    store: mysqlStore,
}))

app.use(csrfProtection);
app.use(flash());

app.use(populateRender);

app.use(attachUser);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.use(errorHandling);

sequelize.sync({
    // force: true
})
.then(db => {
    app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
})
