const express = require('express');
const createError = require('http-errors');

const logger = require('./server/logger');
const parser = require('./server/parser');
const serveStatic = require('./server/serveStatic');
const configProduction = require('./server/configProduction');
const logicRoute = require('./server/logicRoute');

const attachUser = require('./middleware/attachUser');
const populateRender = require('./middleware/populateRender');
const errorHandling = require('./middleware/errorHandling');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// parser
parser(app);
// server public
serveStatic(app);
// config production
configProduction(app);

app.use(attachUser);
app.use(populateRender);

// logic route
logicRoute(app);
app.use((req, res, next) => {
    res.render('404', {
        pageTitle: 'FreshShop',
    });
})
app.use(errorHandling);

app.listen(process.env.PORT || 3000);