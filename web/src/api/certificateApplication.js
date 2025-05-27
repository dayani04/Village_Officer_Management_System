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
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const submitCertificateApplication = async (formData) => {
  try {
    const response = await api.post("/", formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting certificate application:", error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchCertificateApplications = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching certificate applications:", error);
    throw error.response?.data?.error || error.message;
  }
};

export const updateCertificateApplicationStatus = async (applicationId, status) => {
  try {
    if (!["Approved", "Rejected"].includes(status)) {
      throw new Error("Invalid status. Must be 'Approved' or 'Rejected'");
    }
    const response = await api.put(`/${applicationId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for certificate application ${applicationId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/download/${filename}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return { message: "Download initiated" };
  } catch (error) {
    console.error(`Error downloading document ${filename}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchVillagerDetails = async (villagerId) => {
  try {
    const response = await api.get(`/villager/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching villager details for ID ${villagerId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchNotifications = async (villagerId) => {
  try {
    const response = await api.get(`/notifications/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications for villager ID ${villagerId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchApplicationDetails = async (applicationId) => {
  try {
    const response = await api.get(`/application/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching application details for ID ${applicationId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const uploadCertificate = async (applicationId, file) => {
  try {
    const formData = new FormData();
    formData.append("certificate", file);
    const response = await api.post(`/upload-certificate/${applicationId}`, formData);
    return response.data;
  } catch (error) {
    console.error(`Error uploading certificate for application ID ${applicationId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const saveCertificatePath = async (applicationId, formData) => {
  try {
    console.log(`Saving certificate for application ID: ${applicationId}`);
    const response = await api.post(`/certificate-applications/save-certificate/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving certificate for ID ${applicationId}:`, error);
    throw error.response?.data?.error || error.message;
  }
  };