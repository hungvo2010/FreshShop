const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const OrderItem = sequelize.define('OrderItem', {
    quantity: Sequelize.INTEGER,
})

module.exports = OrderItem;