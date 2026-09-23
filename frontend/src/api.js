const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let currentAccessToken = null;

export const setAccessToken = (token) => {
  currentAccessToken = token;
};

export const getAccessToken = () => {
  return currentAccessToken;
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (currentAccessToken) {
    headers['Authorization'] = `Bearer ${currentAccessToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  let response = await fetch(url, config);

  if (response.status === 401 && !options._retry && endpoint !== '/auth/login' && endpoint !== '/auth/register' && endpoint !== '/auth/refresh-token') {
    options._retry = true;
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        currentAccessToken = data.accessToken;
        headers['Authorization'] = `Bearer ${currentAccessToken}`;
        return fetch(url, { ...options, headers, credentials: 'include' });
      } else {
        currentAccessToken = null;
      }
    } catch {
      currentAccessToken = null;
    }
  }

  return response;
};
