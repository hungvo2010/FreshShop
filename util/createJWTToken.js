const jwt = require('jsonwebtoken');
const path = require('path');

require('dotenv').config({path: path.join(__dirname, '..', '.env')});

const dev = process.env.NODE_ENV !== 'production';
const JWT_SECRET = dev ? process.env.JWT_SECRET_TEST : process.env.JWT_SECRET_LIVE;

const createToken = user => {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '12h'
    });
    
    return token;
}

module.exports = createToken;