import axios from "axios";
import { getToken, setToken } from "../utils/auth"; // Make sure these utility functions are correctly implemented

const API_URL = "http://localhost:5000/api/villager-officer"; // Updated base URL for village officers

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header to every request if a token is present
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

// Fetch all village officers (GET /village-officer/)
export const fetchVillageOfficers = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching village officers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single village officer by ID (GET /village-officer/:id)
export const fetchVillageOfficer = async (villageOfficerId) => {
  try {
    const response = await api.get(`/${villageOfficerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Add a new village officer (POST /village-officer/)
export const addVillageOfficer = async (newVillageOfficer) => {
  try {
    const response = await api.post("/", newVillageOfficer);
    return response.data;
  } catch (error) {
    console.error("Error adding village officer:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update a village officer (PUT /village-officer/:id)
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

// Delete a village officer (DELETE /village-officer/:id)
export const deleteVillageOfficer = async (villageOfficerId) => {
  try {
    const response = await api.delete(`/${villageOfficerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Login a village officer (POST /village-officer/login)
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

// Fetch village officer profile (GET /village-officer/profile)
export const getProfile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update village officer status (PUT /village-officer/:id/status)
export const updateVillageOfficerStatus = async (villageOfficerId, status) => {
  try {
    const response = await api.put(`/${villageOfficerId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Update village officer password (PUT /village-officer/:id/password)
export const updateVillageOfficerPassword = async (villageOfficerId, newPassword) => {
  try {
    const response = await api.put(`/${villageOfficerId}/password`, { newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error updating password for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

// Send confirmation email (mocked, as it’s server-side)
export const sendConfirmationEmail = async (email) => {
  // Implement the actual email sending functionality as per your server-side setup
  return { message: "Email confirmation handled server-side" };
};