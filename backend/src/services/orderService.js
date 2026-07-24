const Menu = require('../models/Menu');

/**
 * Builds validated order line items from the client-submitted cart, using
 * live price/name data from the DB (never trust prices sent by the client),
 * and computes the total. Throws if any referenced meal is missing or unavailable.
 */
const buildOrderItems = async (cartItems) => {
  const menuIds = cartItems.map((ci) => ci.menuItem);
  const menuDocs = await Menu.find({ _id: { $in: menuIds } });
  const menuMap = new Map(menuDocs.map((m) => [m._id.toString(), m]));

  let totalAmount = 0;
  const items = cartItems.map((ci) => {
    const menuDoc = menuMap.get(ci.menuItem.toString());
    if (!menuDoc) {
      const error = new Error(`Menu item ${ci.menuItem} not found`);
      error.statusCode = 404;
      throw error;
    }
    if (!menuDoc.isAvailable) {
      const error = new Error(`"${menuDoc.name}" is currently unavailable`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotal = menuDoc.price * ci.quantity;
    totalAmount += lineTotal;

    return {
      menuItem: menuDoc._id,
      name: menuDoc.name,
      price: menuDoc.price,
      quantity: ci.quantity,
    };
  });

  return { items, totalAmount };
};

// Defines which status transitions are legal, preventing e.g. reopening a Delivered order
const ALLOWED_TRANSITIONS = {
  Pending: ['Preparing', 'Cancelled'],
  Preparing: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

const isValidTransition = (currentStatus, nextStatus) => {
  return ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus);
};

module.exports = { buildOrderItems, isValidTransition };
