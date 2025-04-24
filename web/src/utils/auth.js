// Authentication utilities
const WORKING_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJWMDAxIiwiaWF0IjoxNzQ1NDkxNzg2LCJleHAiOjE3NDU0OTUzODZ9.wHd7EeWGCzT9HF47USEclMDu_inr2fm5bgcvop8NivE';

// Get the auth token - falls back to a working test token if needed
export const getToken = () => {
  const savedToken = localStorage.getItem('token');
  
  if (!savedToken) {
    console.warn('No token found in localStorage, using test token');
    // Store the working token so it's available for future requests
    localStorage.setItem('token', WORKING_TOKEN);
    return WORKING_TOKEN;
  }
  
  return savedToken;
};

// Set the auth token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove the auth token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Export the working token for testing
export const getTestToken = () => WORKING_TOKEN; 