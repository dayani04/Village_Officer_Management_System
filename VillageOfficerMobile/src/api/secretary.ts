import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.20.10.3:5000/api/secretaries";

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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const loginSecretary = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", { email, password });
    if (response.data && response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateSecretary = async (secretaryId: string, updatedSecretary: any) => {
  try {
    const payload = {
      full_name: updatedSecretary.full_name || "",
      email: updatedSecretary.email || "",
      phone_no: updatedSecretary.phone_no || "",
      nic: updatedSecretary.nic || "",
      dob: updatedSecretary.dob || "",
      address: updatedSecretary.address || "",
      regional_division: updatedSecretary.regional_division || "",
      status: updatedSecretary.status || "Active",
      area_id: updatedSecretary.area_id || "",
    };

    if (!payload.full_name || !payload.email || !payload.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }

    const response = await api.put(`/${secretaryId}`, payload);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordOtp = async (email: string) => {
  try {
    const response = await api.post("/request-otp", { email });
    return response.data;
  } catch (error: any) {
    console.error(`Error requesting OTP for email ${email}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyPasswordOtp = async (secretaryId: string, otp: string, newPassword: string) => {
  try {
    const response = await api.post(`/${secretaryId}/verify-otp`, { otp, newPassword });
    return response.data;
  } catch (error: any) {
    console.error(`Error verifying OTP for secretary ${secretaryId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendConfirmationEmail = async (email: string) => {
  return { message: "Email confirmation handled server-side" };
};
