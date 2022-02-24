const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.indexOf('image') !== -1){
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
});

module.exports = upload;