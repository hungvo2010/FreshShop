const session = require('express-session');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const MySQLStore = require('express-mysql-session')(session);
const mysqlStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'session',
})

const sess = {
    secret: process.env.SESSION_SECRET,
    resave: false, //update session in db only when some change is maked
    saveUninitialized: false, //save session in db only when some data is initialized
    store: mysqlStore,
}

module.exports = app => {
    app.use(session(sess));
}