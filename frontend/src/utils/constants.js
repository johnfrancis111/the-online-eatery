// Must stay in sync with backend/src/models/Order.js ORDER_STATUSES
export const ORDER_STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const ACTIVE_STATUSES = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

// Valid forward transitions an admin can move an order through.
export const NEXT_STATUS = {
  Pending: ['Preparing', 'Cancelled'],
  Preparing: ['Out for Delivery', 'Cancelled'],
  'Out for Delivery': ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

export const STATUS_STYLES = {
  Pending: { dot: 'bg-turmeric', text: 'text-turmeric' },
  Preparing: { dot: 'bg-turmeric', text: 'text-turmeric' },
  'Out for Delivery': { dot: 'bg-pepper', text: 'text-pepper' },
  Delivered: { dot: 'bg-basil', text: 'text-basil' },
  Cancelled: { dot: 'bg-ivory-300/40', text: 'text-ivory-300/60' },
};
