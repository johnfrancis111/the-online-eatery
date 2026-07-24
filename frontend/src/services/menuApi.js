import apiClient from './apiClient';

// params: { search, category, minPrice, maxPrice, page, limit }
export const getMenuItems = async (params = {}) => {
  const { data } = await apiClient.get('/menu', { params });
  return data; // { success, data, pagination }
};

export const getMenuItem = async (id) => {
  const { data } = await apiClient.get(`/menu/${id}`);
  return data.data;
};

export const getCategories = async () => {
  const { data } = await apiClient.get('/menu/categories');
  return data.data;
};

export const createMenuItem = async (payload) => {
  const { data } = await apiClient.post('/menu', payload);
  return data.data;
};

export const updateMenuItem = async (id, payload) => {
  const { data } = await apiClient.put(`/menu/${id}`, payload);
  return data.data;
};

export const deleteMenuItem = async (id) => {
  const { data } = await apiClient.delete(`/menu/${id}`);
  return data;
};
