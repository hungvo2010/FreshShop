const express = require('express');

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

// cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
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
    res.render('error/404', {
        pageTitle: 'FreshShop',
    });
})
app.use(errorHandling);

app.listen(process.env.PORT || 3000);