const express = require('express');
const { getAdminStats, getRecentOrders } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/recent-orders', protect, admin, getRecentOrders);

module.exports = router;