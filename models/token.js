const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Token = sequelize.define('Token', {
    userId: {
        type: Sequelize.INTEGER,
        require: true,
    },
    token: {
        type: Sequelize.STRING,
        require: true,
    },
    expirationDate: {
        type: Sequelize.DATE,
        require: true,
        defaultValue: new Date(Date.now() + 3600000),
    }
})

module.exports = Token;