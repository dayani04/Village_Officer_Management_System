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
    console.log("Request:", config);
    return config;
  },
  (error) => Promise.reject(error)
);

export const submitPermitApplication = async (formData) => {
  try {
    const response = await api.post("/permit-applications/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting permit application:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchPermitApplications = async () => {
  try {
    const response = await api.get("/permit-applications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching permit applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchConfirmedPermitApplications = async () => {
  try {
    const response = await api.get("/permit-applications/confirmed");
    return response.data;
  } catch (error) {
    console.error("Error fetching confirmed permit applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updatePermitApplicationStatus = async (villagerId, permitsId, status) => {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    console.log("Sending status update:", { villagerId, permitsId, status });
    const response = await api.put(`/permit-applications/${villagerId}/${permitsId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating permit application status for ${villagerId}, ${permitsId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/permit-applications/download/${filename}`, {
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
    const response = await api.post("/permit-applications/notifications/", { villagerId, message });
    return response.data;
  } catch (error) {
    console.error("Error saving notification:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response ? error.response.data : error.message;
  }
};