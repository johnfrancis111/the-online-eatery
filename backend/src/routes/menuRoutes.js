const express = require('express');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
} = require('../controllers/menuController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');
const {
  createMenuValidator,
  updateMenuValidator,
  searchMenuValidator,
} = require('../validators/menuValidators');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', optionalAuth, searchMenuValidator, validateRequest, getMenuItems);
router.get('/:id', getMenuItemById);

router.post('/', protect, adminOnly, createMenuValidator, validateRequest, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuValidator, validateRequest, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
