const bodyParser = require('body-parser');
const upload = require('../service/upload');

module.exports = app => {
    app.use(upload.single('image'));
    app.use(bodyParser.urlencoded({ extended: false }));
}