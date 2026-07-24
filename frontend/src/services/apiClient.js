import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL });

// Attach the JWT (if we have one) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('eatery_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so callers can just read err.message.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong. Please try again.';

    if (error.response?.status === 401) {
      // Token is missing/expired/invalid — drop local session so the UI
      // can redirect to login on the next protected-route check.
      localStorage.removeItem('eatery_token');
      localStorage.removeItem('eatery_user');
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
