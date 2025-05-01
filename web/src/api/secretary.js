import axios from "axios";
import { getToken, setToken } from "../utils/auth";

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
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch all secretaries (GET /secretaries/)
export const fetchSecretaries = async () => {
  try {
    const response = await api.get("/secretaries/");
    return response.data;
  } catch (error) {
    console.error("Error fetching secretaries:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single secretary by ID (GET /secretaries/:id)
export const fetchSecretary = async (secretaryId) => {
  try {
    const response = await api.get(`/secretaries/${secretaryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Add a new secretary (POST /secretaries/)
export const addSecretary = async (newSecretary) => {
  try {
    const response = await api.post("/secretaries/", newSecretary);
    return response.data;
  } catch (error) {
    console.error("Error adding secretary:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update a secretary (PUT /secretaries/:id)
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

    const response = await api.put(`/secretaries/${secretaryId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Delete a secretary (DELETE /secretaries/:id)
export const deleteSecretary = async (secretaryId) => {
  try {
    const response = await api.delete(`/secretaries/${secretaryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Login a secretary (POST /secretaries/login)
export const loginSecretary = async (email, password) => {
  try {
    const response = await api.post("/secretaries/login", { email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch secretary profile (GET /secretaries/profile)
export const getProfile = async () => {
  try {
    const response = await api.get("/secretaries/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update secretary status (PUT /secretaries/:id/status)
export const updateSecretaryStatus = async (secretaryId, status) => {
  try {
    const response = await api.put(`/secretaries/${secretaryId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update secretary password (PUT /secretaries/:id/password)
export const updateSecretaryPassword = async (secretaryId, newPassword) => {
  try {
    const response = await api.put(`/secretaries/${secretaryId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Send confirmation email (mocked, as it’s server-side)
export const sendConfirmationEmail = async (email) => {
  return { message: "Email confirmation handled server-side" };
};