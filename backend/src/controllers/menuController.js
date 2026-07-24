const Menu = require('../models/Menu');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all menu items, with optional search/filter/pagination
// @route   GET /api/menu?search=&category=&minPrice=&maxPrice=&page=&limit=
// @access  Public
const getMenuItems = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

  const filter = {};

  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Customers should only ever see available items; admins get everything
  // (admin-only "manage" endpoints can bypass this via a query flag if needed)
  if (!req.user || req.user.role !== 'admin') {
    filter.isAvailable = true;
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const [items, total] = await Promise.all([
    Menu.find(filter)
      .sort({ category: 1, name: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Menu.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: items,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get a single menu item by id
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Meal not found');
  }
  res.status(200).json({ success: true, data: item });
});

// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, imageUrl, isAvailable } = req.body;

  const item = await Menu.create({
    name,
    description,
    price,
    category,
    imageUrl,
    isAvailable,
  });

  res.status(201).json({ success: true, data: item });
});

// @desc    Update an existing menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Meal not found');
  }

  const fields = ['name', 'description', 'price', 'category', 'imageUrl', 'isAvailable'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });

  const updated = await item.save();
  res.status(200).json({ success: true, data: updated });
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Meal not found');
  }

  await item.deleteOne();
  res.status(200).json({ success: true, message: 'Meal deleted successfully' });
});

// @desc    Get distinct list of categories (for filter UI)
// @route   GET /api/menu/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Menu.distinct('category', { isAvailable: true });
  res.status(200).json({ success: true, data: categories });
});

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories,
};
