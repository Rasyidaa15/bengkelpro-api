const sequelize = require('../config/db');
const User = require('./User');
const Category = require('./Category');
const Supplier = require('./Supplier');
const Product = require('./Product');
const Service = require('./Service');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
User.hasMany(Order);
Order.belongsTo(User);

Category.hasMany(Product);
Product.belongsTo(Category);

Supplier.hasMany(Product);
Product.belongsTo(Supplier);

Service.hasMany(OrderItem);
OrderItem.belongsTo(Service);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

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