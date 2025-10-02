import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api/certificate-applications";

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

export const fetchApplicationDetails = async (applicationId) => {
  try {
    console.log(`Fetching application details for ID: ${applicationId}`);
    const response = await api.get(`/application/${applicationId}`);
    console.log(`Application details response:`, response.data);
    if (!response.data) {
      throw new Error(`No data returned for application ID ${applicationId}`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching application details for ID ${applicationId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message);
  }
};

export const fetchVillageOfficerProfile = async () => {
  try {
    console.log(`Calling API: ${API_URL}/village-officers/profile`);
    const response = await api.get(`/village-officers/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching villager_officer profile:", error);
    throw error.response?.data?.error || error.message;
  }
};

export const saveCertificatePath = async (applicationId, formData) => {
  try {
    console.log(`Saving certificate for application ID: ${applicationId}`);
    const response = await api.post(`/save-certificate/${applicationId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(`Save certificate response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error saving certificate for ID ${applicationId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || `Failed to save certificate: ${error.message}`);
  }
};

export const downloadDocument = async (filename) => {
  try {
    console.log(`Downloading certificate: ${filename}`);
    const response = await api.get(`/download/${filename}`, {
      responseType: "blob", // Important for file downloads
    });
    // Create a temporary URL for the blob and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log(`Certificate ${filename} downloaded successfully`);
  } catch (error) {
    console.error(`Error downloading certificate ${filename}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.error || `Failed to download certificate: ${error.message}`);
  }
};