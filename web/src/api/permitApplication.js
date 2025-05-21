import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
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

// Submit permit application (POST /permit-applications/)
export const submitPermitApplication = async (formData) => {
  try {
    const response = await api.post("/permit-applications/", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting permit application:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error;
  }
};