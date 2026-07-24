import apiClient from './apiClient';

// items: [{ menuItem: id, quantity }], deliveryAddress: { street, city, state, zipCode }
export const createOrder = async ({ items, deliveryAddress }) => {
  const { data } = await apiClient.post('/orders', { items, deliveryAddress });
  return data.data;
};

export const getMyOrders = async () => {
  const { data } = await apiClient.get('/orders/mine');
  return data.data;
};

export const getOrderById = async (id) => {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.data;
};

export const getAllOrders = async (status) => {
  const { data } = await apiClient.get('/orders', { params: status ? { status } : {} });
  return data.data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
  return data.data;
};

export const getDashboardMetrics = async () => {
  const { data } = await apiClient.get('/orders/dashboard/metrics');
  return data.data;
};
