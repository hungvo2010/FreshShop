const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const compression = require('compression');
const csrf = require('csurf');


module.exports = app => {
    app.enable('trust proxy');

    app.use(rateLimit({
        max: 5000,
        windowMs: 60 * 60 * 1000,
        message: 'Too much requests. Please try again later'
    }));

    app.use(xss());

    app.use(csrfProtection);

    app.use(helmet())
    app.use(compression())
}