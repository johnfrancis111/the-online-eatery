const express = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} = require('../validators/authValidators');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile);

module.exports = router;
