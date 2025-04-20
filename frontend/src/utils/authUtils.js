// src/utils/authUtils.js
import axios from 'axios';

// Set auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Check if user has required role
export const hasRole = (user, requiredRoles) => {
  if (!user) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;

  return requiredRoles.includes(user.role);
};

// Format error messages from API
export const formatErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};
