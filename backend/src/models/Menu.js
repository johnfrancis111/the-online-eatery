const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Meal name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      // e.g. Rice Dishes, Soups, Drinks, Desserts
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index to support name search
menuSchema.index({ name: 'text', description: 'text' });
// Compound index to speed up common category + price range filters
menuSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Menu', menuSchema);
