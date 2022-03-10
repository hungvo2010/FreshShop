const bodyParser = require('body-parser');
const upload = require('../service/upload');
const cookieParser = require('cookie-parser');

module.exports = app => {
    app.use(upload.single('image'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
}