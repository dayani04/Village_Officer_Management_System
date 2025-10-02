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

export const fetchPermits = async () => {
  try {
    console.log("Fetching permits from:", `${API_URL}/permits/`);
    const response = await api.get("/permits/");
    console.log("Fetched permits:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching permits:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const checkVillagerPermitApplication = async (villagerId, year, month) => {
  try {
    console.log(`Checking permit applications for villager ${villagerId} in ${year}-${month} from:`, `${API_URL}/permits/check-application`);
    const response = await api.post("/permits/check-application", { villagerId, year, month });
    console.log(`Fetched applications for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error checking applications for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const submitPermitApplication = async (formData) => {
  try {
    console.log("Submitting permit application to:", `${API_URL}/permit-applications/`);
    const response = await api.post("/permit-applications/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Permit application response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting permit application:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};