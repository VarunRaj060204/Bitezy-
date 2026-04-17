const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder,
  updateOrderStatus, getAllOrders, getDashboardStats
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.get('/admin/stats', protect, admin, getDashboardStats);
router.get('/admin/all', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
