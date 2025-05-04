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

// Fetch all permits (GET /permits/)
export const fetchPermits = async () => {
  try {
    const response = await api.get("/permits/");
    return response.data;
  } catch (error) {
    console.error("Error fetching permits:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single permit by ID (GET /permits/:id)
export const fetchPermit = async (permitId) => {
  try {
    const response = await api.get(`/permits/${permitId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching permit ${permitId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};