const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: Sequelize.STRING,
  imageUrl: Sequelize.STRING,
  price: Sequelize.FLOAT,
  description: Sequelize.STRING,
});

module.exports = Product;