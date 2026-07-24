const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardMetrics,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createOrderValidator,
  updateOrderStatusValidator,
} = require('../validators/orderValidators');

const router = express.Router();

// Customer routes
router.post('/', protect, createOrderValidator, validateRequest, createOrder);
router.get('/mine', protect, getMyOrders);

// Admin routes (declared before /:id so they aren't swallowed by the param route)
router.get('/dashboard/metrics', protect, adminOnly, getDashboardMetrics);
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatusValidator, validateRequest, updateOrderStatus);

// Shared (owner or admin, enforced in controller)
router.get('/:id', protect, getOrderById);

module.exports = router;
