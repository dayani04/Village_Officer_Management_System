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
  (error) => Promise.reject(error)
);

export const fetchVillagers = async () => {
  try {
    const response = await api.get("/villagers/");
    return response.data;
  } catch (error) {
    console.error("Error fetching villagers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillager = async (villagerId) => {
  try {
    const response = await api.get(`/villagers/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const addVillager = async (newVillager) => {
  try {
    const payload = {
      ...newVillager,
      is_participant: Boolean(newVillager.is_participant),
      gender: newVillager.gender || "Other",
      marital_status: newVillager.marital_status || "Unmarried"
    };
    const response = await api.post("/villagers/", payload);
    return response.data;
  } catch (error) {
    console.error("Error adding villager:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillager = async (villagerId, updatedVillager) => {
  try {
    const payload = {
      full_name: updatedVillager.full_name || "",
      email: updatedVillager.email || "",
      phone_no: updatedVillager.phone_no || "",
      address: updatedVillager.address !== undefined ? updatedVillager.address : null,
      regional_division: updatedVillager.regional_division !== undefined ? updatedVillager.regional_division : null,
      status: updatedVillager.status || "Active",
      is_election_participant: Boolean(updatedVillager.is_election_participant),
      alive_status: updatedVillager.alive_status || "Alive",
      job: updatedVillager.job !== undefined ? updatedVillager.job : null,
      gender: updatedVillager.gender || "Other",
      marital_status: updatedVillager.marital_status || "Unmarried"
    };

    if (!payload.full_name || !payload.email || !payload.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }

    const response = await api.put(`/villagers/${villagerId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteVillager = async (villagerId) => {
  try {
    const response = await api.delete(`/villagers/${villagerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const loginVillager = async (email, password) => {
  try {
    const response = await api.post("/villagers/login", { email, password });
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
    const response = await api.get("/villagers/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerStatus = async (villagerId, status) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating status for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerLocation = async (villagerId, latitude, longitude) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/location`, { latitude, longitude });
    return response.data;
  } catch (error) {
    console.error(`Error updating location for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getVillagerLocation = async (villagerId) => {
  try {
    const response = await api.get(`/villagers/${villagerId}/location`);
    return response.data;
  } catch (error) {
    console.error(`Error getting location for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordOtp = async (email) => {
  try {
    const response = await api.post("/villagers/request-otp", { email });
    return response.data;
  } catch (error) {
    console.error(`Error requesting OTP for email ${email}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyPasswordOtp = async (villagerId, otp, newPassword) => {
  try {
    const response = await api.post(`/villagers/${villagerId}/verify-otp`, { otp, newPassword });
    return response.data;
  } catch (error) {
    console.error(`Error verifying OTP for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendConfirmationEmail = async (email) => {
  return { message: "Email confirmation handled server-side" };
};

export const sendNotification = async (villagerId, message) => {
  try {
    const response = await api.post(`/villagers/${villagerId}/notification`, { message });
    return response.data;
  } catch (error) {
    console.error(`Error sending notification for villager ${villagerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get("/villagers/notifications");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error.response ? error.response.data : error.message;
  }
};


export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/villagers/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error.response ? error.response.data : error.message;
  }
};
