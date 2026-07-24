import apiClient from './apiClient';

export const register = async ({ name, email, password, phoneNumber }) => {
  const { data } = await apiClient.post('/auth/register', { name, email, password, phoneNumber });
  return data.data;
};

export const login = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data.data;
};

export const getProfile = async () => {
  const { data } = await apiClient.get('/auth/profile');
  return data.data;
};

export const updateProfile = async (updates) => {
  const { data } = await apiClient.put('/auth/profile', updates);
  return data.data;
};
