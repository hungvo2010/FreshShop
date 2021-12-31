const Sequelize = require('sequelize');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '.env')});

const sequelize = new Sequelize('node_complete', process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
});

module.exports = sequelize;