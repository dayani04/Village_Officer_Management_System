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

export const fetchCertificateDetails = async (applicationId) => {
  try {
    console.log(`Calling API: ${API_URL}/certificate-applications/certificate/${applicationId}`);
    const response = await api.get(`/certificate-applications/certificate/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching certificate details for ID ${applicationId}:`, error);
    throw error.response?.data?.error || error.message;
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
    const response = await api.post(`/certificate-applications/save-certificate/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.message || 'Unknown API error';
  }
};

