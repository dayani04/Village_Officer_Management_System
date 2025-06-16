import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api/permit-applications";
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
    if (!(formData instanceof FormData)) {
      throw new Error("FormData is required for submission");
    }
    const response = await api.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Submit permit application response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting permit application:", {
      message: error.message,
      response: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null,
      url: API_URL + "/",
    });
    throw error.response?.data?.error || error.message;
  }
};

export const fetchPermitApplications = async () => {
  try {
    const response = await api.get("/");
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
    const response = await api.get("/confirmed");
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
    const response = await api.put(`/${villagerId}/${permitsId}/status`, { status });
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
    const response = await api.get(`/download/${filename}`, {
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
    const response = await api.post("/notifications/", { villagerId, message });
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