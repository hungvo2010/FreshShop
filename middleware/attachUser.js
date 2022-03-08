const jwt = require("jsonwebtoken");
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '.env')});

const dev = process.env.NODE_ENV !== 'production';
const JWT_SECRET = dev ? process.env.JWT_SECRET_TEST : process.env.JWT_SECRET_LIVE;

module.exports = async (req, res, next) => {
    let token;
    if (req.headers['Authorization'] && req.headers['Authorization'].startsWith('Bearer')){
        token = req.headers['Authorization'].split(' ')[1];
    }
    token = token || req.cookies.jwt;
    if (!token){
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }

    catch (err) {
        next();
    }
    
}