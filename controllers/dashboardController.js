const { Product, User, Order } = require('../models');

exports.getAdminStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const revenue = await Order.sum('total', { where: { status: 'completed' } });
    res.json({ 
      products: totalProducts, 
      users: totalUsers, 
      orders: totalOrders, 
      revenue: revenue || 0 
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      limit: 5,
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ message: error.message });
  }
};