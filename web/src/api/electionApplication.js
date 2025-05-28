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

export const submitElectionApplication = async (formData) => {
  try {
    const response = await api.post("/election-applications/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting election application:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchElectionApplications = async () => {
  try {
    const response = await api.get("/election-applications/");
    return response.data;
  } catch (error) {
    console.error("Error fetching election applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchConfirmedElectionApplications = async () => {
  try {
    const response = await api.get("/election-applications/confirmed");
    return response.data;
  } catch (error) {
    console.error("Error fetching confirmed election applications:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateElectionApplicationStatus = async (villagerId, electionrecodeID, status) => {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    const response = await api.put(`/election-applications/${villagerId}/${electionrecodeID}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating election application status for ${villagerId}, ${electionrecodeID}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/election-applications/download/${filename}`, {
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
    const response = await api.post("/election-applications/notifications/", { villagerId, message });
    return response.data;
  } catch (error) {
    console.error("Error saving notification:", error);
    throw error.response ? error.response.data : error.message;
  }
};