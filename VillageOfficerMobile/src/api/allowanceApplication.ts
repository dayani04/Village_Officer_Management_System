import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://172.20.10.3:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added token to allowance request:', token);
      } else {
        console.warn('No token found for allowance request');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const fetchAllowanceApplications = async () => {
  try {
    const response = await api.get("/allowance-applications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching allowance applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchConfirmedAllowanceApplications = async () => {
  try {
    const response = await api.get("/allowance-applications/confirmed");
    return response.data;
  } catch (error) {
    console.error("Error fetching confirmed allowance applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateAllowanceApplicationStatus = async (villagerId, allowancesId, status) => {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    const response = await api.put(`/allowance-applications/${villagerId}/${allowancesId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating allowance application status for ${villagerId}, ${allowancesId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/allowance-applications/download/${filename}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading document ${filename}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const saveNotification = async (villagerId, message) => {
  try {
    const response = await api.post("/allowance-applications/notifications/", { villagerId, message });
    return response.data;
  } catch (error) {
    console.error("Error saving notification:", error);
    throw error.response ? error.response.data : error.message;
  }
};
