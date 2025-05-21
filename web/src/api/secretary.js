import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api/secretaries";

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

export const fetchSecretaries = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching secretaries:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchSecretary = async (secretaryId) => {
  try {
    const response = await api.get(`/${secretaryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const addSecretary = async (newSecretary) => {
  try {
    const response = await api.post("/", newSecretary);
    return response.data;
  } catch (error) {
    console.error("Error adding secretary:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSecretary = async (secretaryId, updatedSecretary) => {
  try {
    const payload = {
      full_name: updatedSecretary.full_name || "",
      email: updatedSecretary.email || "",
      phone_no: updatedSecretary.phone_no || "",
      status: updatedSecretary.status || "Active",
    };

    if (!payload.full_name || !payload.email || !payload.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }

    const response = await api.put(`/${secretaryId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteSecretary = async (secretaryId) => {
  try {
    const response = await api.delete(`/${secretaryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const loginSecretary = async (email, password) => {
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

export const updateSecretaryStatus = async (secretaryId, status) => {
  try {
    const response = await api.put(`/${secretaryId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSecretaryPassword = async (secretaryId, newPassword) => {
  try {
    const response = await api.put(`/${secretaryId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for secretary ${secretaryId}:`, error);
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

export const verifyPasswordOtp = async (secretaryId, otp, newPassword) => {
  try {
    const response = await api.post(`/${secretaryId}/verify-otp`, { otp, newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error verifying OTP for secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendConfirmationEmail = async (email) => {
  return { message: "Email confirmation handled server-side" };
};