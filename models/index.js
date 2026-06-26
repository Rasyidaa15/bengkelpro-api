const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Supplier = require('./Supplier');
const Product = require('./Product');
const Service = require('./Service');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User - Order
User.hasMany(Order, {
  foreignKey: 'userId'
});
Order.belongsTo(User, {
  foreignKey: 'userId'
});

// Category - Product
Category.hasMany(Product, {
  foreignKey: 'categoryId'
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// Supplier - Product
Supplier.hasMany(Product, {
  foreignKey: 'supplierId'
});
Product.belongsTo(Supplier, {
  foreignKey: 'supplierId'
});

// Service - OrderItem
Service.hasMany(OrderItem, {
  foreignKey: 'serviceId'
});
OrderItem.belongsTo(Service, {
  foreignKey: 'serviceId'
});

// Order - OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'orderId'
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

// Product - OrderItem
Product.hasMany(OrderItem, {
  foreignKey: 'productId'
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId'
});

module.exports = {
  sequelize,
  User,
  Category,
  Supplier,
  Product,
  Service,
  Order,
  OrderItem,
};
