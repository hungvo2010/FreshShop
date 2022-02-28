const express = require('express');
const logger = require('./server/logger');
const parser = require('./server/parser');
const serveStatic = require('./server/serveStatic');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const attachUser = require('./middleware/attachUser');
const populateRender = require('./middleware/populateRender');
const errorHandling = require('./middleware/errorHandling');

const app = express();



const csrfProtection = csrf();



app.set('view engine', 'ejs');
app.set('views', 'views');



// loging
logger(app);
// parser
parser(app);
// server public
serveStatic(app);

app.use(session())


app.use(flash());

app.use(populateRender);

app.use(attachUser);

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

app.use(errorHandling);

let server;

sequelize.sync({
    // force: true
})
.then(db => {
    server = app.listen(process.env.PORT || 3000);
})
.catch(err => {
    console.log(err);
})

process.on('SIGTERM', () => {
    server.close();
});
