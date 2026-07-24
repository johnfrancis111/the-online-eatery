const { body, query } = require('express-validator');

const createMenuValidator = [
  body('name').trim().notEmpty().withMessage('Meal name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('imageUrl').optional().isString(),
  body('isAvailable').optional().isBoolean(),
];

const updateMenuValidator = [
  body('name').optional().trim().notEmpty().withMessage('Meal name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('imageUrl').optional().isString(),
  body('isAvailable').optional().isBoolean(),
];

const searchMenuValidator = [
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

module.exports = { createMenuValidator, updateMenuValidator, searchMenuValidator };
