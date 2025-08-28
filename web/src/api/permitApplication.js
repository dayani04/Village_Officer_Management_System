import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
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
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data instanceof FormData ? [...config.data.entries()] : config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

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

export const fetchPermitApplications = async () => {
  try {
    const response = await api.get("/permit-applications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching permit applications:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response?.data?.error || error.message;
  }
};

export const fetchConfirmedPermitApplications = async () => {
  try {
    const response = await api.get("/permit-applications/confirmed");
    return response.data;
  } catch (error) {
    console.error("Error fetching confirmed permit applications:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response?.data?.error || error.message;
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
    console.error(`Error updating permit application status for ${villagerId}, ${permitsId}:`, {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response?.data?.error || error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/permit-applications/download/${filename}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading document ${filename}:`, {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
    });
    throw error.response?.data?.error || error.message;
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
    throw error.response?.data?.error || error.message;
  }
};