const { validationResult } = require('express-validator');

/**
 * Runs after a validator rule-set array. If express-validator collected any
 * errors, responds 400 with a clear message list instead of letting the
 * request continue into the controller.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validateRequest;
