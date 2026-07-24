const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
];

const loginValidator = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phoneNumber').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
  body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
];

module.exports = { registerValidator, loginValidator, updateProfileValidator };
