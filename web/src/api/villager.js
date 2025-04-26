import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch all villagers (GET /villagers/)
export const fetchVillagers = async () => {
  try {
    const response = await api.get("/villagers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching villagers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single villager by ID (GET /villagers/:id)
export const fetchVillager = async (villagerId) => {
  try {
    const response = await api.get(`/villagers/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Add a new villager (POST /villagers/)
export const addVillager = async (newVillager) => {
  try {
    const response = await api.post("/villagers/", newVillager);
    return response.data;
  } catch (error) {
    console.error("Error adding villager:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update a villager (PUT /villagers/:id)
export const updateVillager = async (villagerId, updatedVillager) => {
  try {
    const response = await api.put(`/villagers/${villagerId}`, updatedVillager);
    return response.data;
  } catch (error) {
    console.error(`Error updating villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a villager (DELETE /villagers/:id)
export const deleteVillager = async (villagerId) => {
  try {
    const response = await api.delete(`/villagers/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Login a villager (POST /villagers/login)
export const loginVillager = async (email, password) => {
  try {
    const response = await api.post("/villagers/login", { email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch villager profile (GET /villagers/profile)
export const getProfile = async () => {
  try {
    const response = await api.get("/villagers/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update villager status (PUT /villagers/:id/status)
export const updateVillagerStatus = async (villagerId, status) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update villager password (PUT /villagers/:id/password)
export const updateVillagerPassword = async (villagerId, newPassword) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};