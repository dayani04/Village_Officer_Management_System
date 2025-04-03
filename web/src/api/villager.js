import axios from "axios";

// Set up the API base URL
const API_URL = "http://localhost:9000"; // Your API base URL

// Create an instance of axios to include default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// You can optionally set the token here if you store it in localStorage
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Fetch all villagers
export const fetchVillagers = async () => {
  try {
    const response = await api.get("/api/villager");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single villager by ID
export const fetchVillager = async (villagerId) => {
  try {
    const response = await api.get(`/api/villager/${villagerId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create a new villager
export const createVillager = async (newVillager) => {
  try {
    const response = await api.post("/api/villager", newVillager);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update an existing villager
export const updateVillager = async (villagerId, updatedVillager) => {
  try {
    const response = await api.put(`/api/villager/${villagerId}`, updatedVillager);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a villager
export const deleteVillager = async (villagerId) => {
  try {
    const response = await api.delete(`/api/villager/${villagerId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Login a villager and get the JWT token
export const loginVillager = async (email, password) => {
  try {
    const response = await api.post("/api/villager/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Get profile of the logged-in villager
export const getProfile = async () => {
  try {
    const response = await api.get("/api/villager/profile");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update the status of a villager (Active/Inactive)
export const updateVillagerStatus = async (villagerId, status) => {
  try {
    const response = await api.put(`/api/villager/${villagerId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update villager password
export const updateVillagerPassword = async (villagerId, newPassword) => {
  try {
    const response = await api.put(`/api/villager/${villagerId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
