import axios from "axios";
import { getToken } from "../utils/auth";

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
  (error) => Promise.reject(error)
);

// Fetch all NIC types (GET /nics/)
export const fetchNICs = async () => {
  try {
    const response = await api.get("/nics/");
    return response.data;
  } catch (error) {
    console.error("Error fetching NIC types:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single NIC by ID (GET /nics/:id)
export const fetchNIC = async (nicId) => {
  try {
    const response = await api.get(`/nics/${nicId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching NIC ${nicId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};