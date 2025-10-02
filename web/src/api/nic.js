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

export const fetchNICs = async () => {
  try {
    const response = await api.get("/nics/");
    return response.data;
  } catch (error) {
    console.error("Error fetching NIC types:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNIC = async (nicId) => {
  try {
    const response = await api.get(`/nics/${nicId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching NIC ${nicId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const submitNICApplication = async (formData) => {
  try {
    const response = await api.post("/nic-applications/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting NIC application:", error);
    throw error.response ? error.response.data : error.message;
  }
};