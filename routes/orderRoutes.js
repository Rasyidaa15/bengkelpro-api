const express = require('express');
const {
  getOrders,
  getUserOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/admin', protect, admin, getOrders);
router.get('/', protect, getUserOrders);
router.post('/', protect, createOrder);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;