const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Cart = sequelize.define('Cart', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
});

module.exports = Cart;