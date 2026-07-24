const { body } = require('express-validator');
const { ORDER_STATUSES } = require('../models/Order');

const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Order must include at least one item'),
  body('items.*.menuItem').notEmpty().withMessage('Each item must reference a menu item id'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').trim().notEmpty().withMessage('City is required'),
  body('deliveryAddress.state').trim().notEmpty().withMessage('State is required'),
  body('deliveryAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
];

const updateOrderStatusValidator = [
  body('status')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];

module.exports = { createOrderValidator, updateOrderStatusValidator };
