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
      console.log("Added token to request:", token);
    } else {
      console.warn("No token found for request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all allowances (GET /allowances/)
export const fetchAllowances = async () => {
  try {
    console.log("Fetching allowances from:", `${API_URL}/allowances/`);
    const response = await api.get("/allowances/");
    console.log("Fetched allowances:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching allowances:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single allowance by ID (GET /allowances/:id)
export const fetchAllowance = async (allowanceId) => {
  try {
    console.log(`Fetching allowance ${allowanceId} from:`, `${API_URL}/allowances/${allowanceId}`);
    const response = await api.get(`/allowances/${allowanceId}`);
    console.log(`Fetched allowance ${allowanceId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching allowance ${allowanceId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Check villager's allowance applications (POST /allowances/check-application)
export const checkVillagerAllowanceApplication = async (villagerId) => {
  try {
    console.log(`Checking allowance applications for villager ${villagerId} from:`, `${API_URL}/allowances/check-application`);
    const response = await api.post("/allowances/check-application", { villagerId });
    console.log(`Fetched allowance applications for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error checking allowance applications for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const submitAllowanceApplication = async (formData) => {
  try {
    const response = await api.post("/allowance-applications/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting allowance application:", error);
    throw error.response ? error.response.data : error.message;
  }
};