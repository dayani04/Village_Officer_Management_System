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

// Fetch all allowances (GET /allowances/)
export const fetchAllowances = async () => {
  try {
    const response = await api.get("/allowances/");
    return response.data;
  } catch (error) {
    console.error("Error fetching allowances:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single allowance by ID (GET /allowances/:id)
export const fetchAllowance = async (allowanceId) => {
  try {
    const response = await api.get(`/allowances/${allowanceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching allowance ${allowanceId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};