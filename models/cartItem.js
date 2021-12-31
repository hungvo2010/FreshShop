const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('CartItem', {
    quantity: Sequelize.INTEGER,
})

module.exports = CartItem;