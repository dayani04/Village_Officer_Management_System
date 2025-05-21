import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data", // Required for file uploads
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

// Submit election application (POST /election-applications/)
export const submitElectionApplication = async (formData) => {
  try {
    const response = await api.post("/election-applications/", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting election application:", error);
    throw error.response ? error.response.data : error.message;
  }
};