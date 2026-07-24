const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const { buildOrderItems, isValidTransition } = require('../services/orderService');

// @desc    Place a new order (checkout)
// @route   POST /api/orders
// @access  Private (customer)
const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress } = req.body;

  const { items: orderItems, totalAmount } = await buildOrderItems(items);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    deliveryAddress,
    totalAmount,
  });

  res.status(201).json({ success: true, data: order });
});

// @desc    Get the authenticated customer's own order history
// @route   GET /api/orders/mine
// @access  Private (customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: orders });
});

// @desc    Get a single order (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied: this order does not belong to you');
  }

  res.status(200).json({ success: true, data: order });
});

// @desc    Get all orders, optionally filtered by status (admin)
// @route   GET /api/orders?status=
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const orders = await Order.find(filter).populate('user', 'name email phoneNumber').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: orders });
});

// @desc    Update an order's status (admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!isValidTransition(order.status, status)) {
    res.status(400);
    throw new Error(`Cannot transition order from "${order.status}" to "${status}"`);
  }

  order.status = status;
  const updated = await order.save();

  res.status(200).json({ success: true, data: updated });
});

// @desc    Get dashboard summary metrics (admin)
// @route   GET /api/orders/dashboard/metrics
// @access  Private/Admin
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const [totalOrders, pendingOrders, revenueAgg] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'Pending' }),
    Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
    },
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardMetrics,
};
