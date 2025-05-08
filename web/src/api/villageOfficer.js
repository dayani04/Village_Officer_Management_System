import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api/villager-officer";

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
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchVillageOfficers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching village officers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillageOfficer = async (villageOfficerId) => {
  try {
    const response = await api.get(`/${villageOfficerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const addVillageOfficer = async (newVillageOfficer) => {
  try {
    const response = await api.post("/", newVillageOfficer);
    return response.data;
  } catch (error) {
    console.error("Error adding village officer:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillageOfficer = async (villageOfficerId, updatedVillageOfficer) => {
  try {
    const payload = {
      full_name: updatedVillageOfficer.full_name || "",
      email: updatedVillageOfficer.email || "",
      phone_no: updatedVillageOfficer.phone_no || "",
      status: updatedVillageOfficer.status || "Active",
    };

    if (!payload.full_name || !payload.email || !payload.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }

    const response = await api.put(`/${villageOfficerId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteVillageOfficer = async (villageOfficerId) => {
  try {
    const response = await api.delete(`/${villageOfficerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const loginVillageOfficer = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillageOfficerStatus = async (villageOfficerId, status) => {
  try {
    const response = await api.put(`/${villageOfficerId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillageOfficerPassword = async (villageOfficerId, newPassword) => {
  try {
    const response = await api.put(`/${villageOfficerId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordOtp = async (email) => {
  try {
    const response = await api.post("/request-otp", { email });
    return response.data;
  } catch (error) {
    console.error(`Error requesting OTP for email ${email}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyPasswordOtp = async (villageOfficerId, otp, newPassword) => {
  try {
    const response = await api.post(`/${villageOfficerId}/verify-otp`, { otp, newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error verifying OTP for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendConfirmationEmail = async (email) => {
  return { message: "Email confirmation handled server-side" };
};