import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.20.10.3:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added token to request:", token);
    } else {
      console.warn("No token found for request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginVillageOfficer = async (email: string, password: string) => {
  try {
    console.log('Attempting village officer login with:', { email, password: '***' });
    console.log('API URL:', api.defaults.baseURL);
    console.log('Endpoint:', '/villager-officers/login');
    
    const response = await api.post("/villager-officers/login", { email, password });
    console.log("Village officer login response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Village officer login error:", error.response?.data || error.message);
    console.error("Full error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/villager-officers/profile");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillageOfficers = async () => {
  try {
    const response = await api.get("/villager-officers");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching village officers:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const addVillageOfficer = async (newVillageOfficer: any) => {
  try {
    const response = await api.post("/villager-officers", newVillageOfficer);
    return response.data;
  } catch (error: any) {
    console.error("Error adding village officer:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillageOfficer = async (villageOfficerId: string, updatedVillageOfficer: any) => {
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

    const response = await api.put(`/villager-officers/${villageOfficerId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteVillageOfficer = async (villageOfficerId: string) => {
  try {
    const response = await api.delete(`/villager-officers/${villageOfficerId}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordOtp = async (email: string) => {
  try {
    const response = await api.post("/villager-officers/request-otp", { email });
    return response.data;
  } catch (error: any) {
    console.error(`Error requesting OTP for email ${email}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyPasswordOtp = async (villageOfficerId: string, otp: string, newPassword: string) => {
  try {
    const response = await api.post(`/villager-officers/${villageOfficerId}/verify-otp`, { otp, newPassword });
    return response.data;
  } catch (error: any) {
    console.error(`Error verifying OTP for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillageOfficerStatus = async (villageOfficerId: string, status: string) => {
  try {
    const response = await api.put(`/villager-officers/${villageOfficerId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating status for village officer ${villageOfficerId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};
