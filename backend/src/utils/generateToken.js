const jwt = require('jsonwebtoken');

/**
 * Signs a JWT for a given user id + role.
 * Keeping the payload minimal (id, role) avoids leaking sensitive data into the token.
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
