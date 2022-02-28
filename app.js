const express = require('express');
const logger = require('./server/logger');
const parser = require('./server/parser');
const serveStatic = require('./server/serveStatic');
const configSession = require('./server/session');
const configProduction = require('./server/configProduction');
const logicRoute = require('./server/logicRoute');

const attachUser = require('./middleware/attachUser');
const populateRender = require('./middleware/populateRender');
const errorHandling = require('./middleware/errorHandling');

const createError = require('http-errors');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

// loging
logger(app);
// parser
parser(app);
// server public
serveStatic(app);
// config session
configSession(app);
// config production
configProduction(app);

app.use(populateRender);
app.use(attachUser);

// logic route
logicRoute(app);
app.use((req, res, next) => {
    return next(createError(404, 'Page not found.'));
})
app.use(errorHandling);

const server = app.listen(process.env.PORT || 3000);

process.on('SIGTERM', () => {
    server.close();
});