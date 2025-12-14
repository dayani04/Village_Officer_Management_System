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

export const submitCertificateApplication = async (formData) => {
  try {
    console.log("Submitting certificate application:", [...formData.entries()]);
    const response = await api.post("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Submit certificate application response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting certificate application:", error.response?.data || error.message);
    throw error.response?.data?.error || "An unexpected error occurred during submission.";
  }
};

// ... other functions remain unchanged
export const fetchCertificateApplications = async () => {
  try {
    console.log("Fetching certificate applications");
    const response = await api.get("/");
    console.log("Fetched certificate applications:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching certificate applications:", error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const updateCertificateApplicationStatus = async (applicationId, status) => {
  try {
    console.log(`Sending status update request for application ID: ${applicationId}, Status: ${status}`);
    if (!["Pending", "Send", "Rejected", "Confirm"].includes(status)) {
      throw new Error("Invalid status. Must be 'Pending', 'Send', 'Rejected', or 'Confirm'");
    }
    const response = await api.put(`/${applicationId}/status`, { status });
    console.log(`Status update response for application ID ${applicationId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for certificate application ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    console.log(`Initiating download for filename: ${filename}`);
    const response = await api.get(`/download/${filename}`, {
      responseType: "blob",
    });
    console.log(`Download response for ${filename}:`, response);
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
    console.error(`Error downloading document ${filename}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchVillagerDetails = async (villagerId) => {
  try {
    console.log(`Fetching villager details for ID: ${villagerId}`);
    const response = await api.get(`/villager/${villagerId}`);
    console.log(`Villager details response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching villager details for ID ${villagerId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchNotifications = async (villagerId) => {
  try {
    console.log(`Fetching notifications for villager ID: ${villagerId}`);
    const response = await api.get(`/notifications/${villagerId}`);
    console.log(`Notifications response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications for villager ID ${villagerId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchApplicationDetails = async (applicationId) => {
  try {
    console.log(`Fetching application details for ID: ${applicationId}`);
    const response = await api.get(`/application/${applicationId}`);
    console.log(`Application details response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching application details for ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const uploadCertificate = async (applicationId, file) => {
  try {
    console.log(`Uploading certificate for application ID: ${applicationId}`);
    const formData = new FormData();
    formData.append("certificate", file);
    const response = await api.post(`/upload-certificate/${applicationId}`, formData);
    console.log(`Upload certificate response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error uploading certificate for application ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const saveCertificatePath = async (applicationId, formData) => {
  try {
    console.log(`Saving certificate for application ID: ${applicationId}`);
    const response = await api.post(`/certificate-applications/save-certificate/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(`Save certificate response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error saving certificate for ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const checkRecentApplication = async (email) => {
  try {
    console.log(`Checking recent applications for email: ${email}`);
    const response = await api.post(`/check-recent`, { email });
    console.log(`Recent application check response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error checking recent applications for email ${email}:`, error.response?.data || error.message);
    throw error.response?.data?.error || "An unexpected error occurred while checking recent applications.";
  }
};

export const fetchUserConfirmedCertificates = async () => {
  try {
    console.log("Fetching user's confirmed certificates");
    const response = await api.get("/user-confirmed-certificates");
    console.log("Fetched user confirmed certificates:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user confirmed certificates:", error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};