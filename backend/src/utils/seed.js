/**
 * Seeds the database with a demo admin account and a starter menu.
 * Run with: npm run seed
 * WARNING: this clears existing Menu and User(role=admin demo) data before inserting.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Menu = require('../models/Menu');
const mongoose = require('mongoose');

const seed = async () => {
  await connectDB();

  const adminEmail = 'admin@theonlineeatery.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Restaurant Admin',
      email: adminEmail,
      password: 'Admin123!',
      phoneNumber: '555-0100',
      role: 'admin',
    });
    console.log(`Created demo admin: ${adminEmail} / Admin123!`);
  } else {
    console.log('Demo admin already exists, skipping.');
  }

  const menuCount = await Menu.countDocuments();
  if (menuCount === 0) {
    await Menu.insertMany([
      {
        name: 'Jollof Rice',
        description: 'Smoky, spiced rice cooked in a rich tomato sauce, served with fried plantain.',
        price: 12.99,
        category: 'Rice Dishes',
        isAvailable: true,
      },
      {
        name: 'Fried Rice',
        description: 'Classic stir-fried rice with mixed vegetables and your choice of protein.',
        price: 11.99,
        category: 'Rice Dishes',
        isAvailable: true,
      },
      {
        name: 'Pepper Soup',
        description: 'A spicy, aromatic broth with tender goat meat and native spices.',
        price: 9.99,
        category: 'Soups',
        isAvailable: true,
      },
      {
        name: 'Chapman',
        description: 'A refreshing non-alcoholic cocktail with citrus and grenadine.',
        price: 4.99,
        category: 'Drinks',
        isAvailable: true,
      },
      {
        name: 'Chin Chin',
        description: 'Crunchy, lightly sweetened fried pastry bites.',
        price: 3.99,
        category: 'Desserts',
        isAvailable: true,
      },
    ]);
    console.log('Seeded starter menu items.');
  } else {
    console.log('Menu already has items, skipping menu seed.');
  }

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
