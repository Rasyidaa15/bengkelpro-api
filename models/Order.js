const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('pending','processed','shipped','completed','cancelled'),
    defaultValue: 'pending'
  },

  paymentMethod: {
    type: DataTypes.ENUM('COD','Transfer'),
    allowNull: false
  },

  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },

  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },

  proof: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Order;