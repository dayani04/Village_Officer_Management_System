
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
      console.log("Added token to request:", token);
    } else {
      console.warn("No token found for request");
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export const fetchVillagers = async () => {
  try {
    const response = await api.get("/villagers");
    console.log("Fetched villagers:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching villagers:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillager = async (villagerId) => {
  try {
    const response = await api.get(`/villagers/${villagerId}`);
    console.log(`Fetched villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const addVillager = async (newVillager) => {
  try {
    const payload = {
      villager_id: newVillager.villager_id,
      full_name: newVillager.full_name || "",
      email: newVillager.email || "",
      password: newVillager.password || "",
      phone_no: newVillager.phone_no || "",
      nic: newVillager.nic || null,
      dob: newVillager.dob || null,
      address: newVillager.address || null,
      regional_division: newVillager.regional_division || null,
      status: newVillager.status || "Active",
      area_id: newVillager.area_id || null,
      latitude: newVillager.latitude || null,
      longitude: newVillager.longitude || null,
      is_election_participant: Boolean(newVillager.is_election_participant),
      alive_status: newVillager.alive_status || "Alive",
      job: newVillager.job || null,
      gender: newVillager.gender || "Other",
      marital_status: newVillager.marital_status || "Unmarried",
      religion: newVillager.religion || "Others",
      race: newVillager.race || "Sinhalese",
    };
    if (!payload.villager_id || !payload.full_name || !payload.email || !payload.password || !payload.phone_no) {
      throw new Error("Villager ID, Full Name, Email, Password, and Phone Number are required");
    }
    const response = await api.post("/villagers", payload);
    console.log("Added villager:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding villager:", error.response || error.message);
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
      marital_status: updatedVillager.marital_status || "Unmarried",
      dob: updatedVillager.dob || null,
      religion: updatedVillager.religion || "Others",
      race: updatedVillager.race || "Sinhalese",
    };
    if (!payload.full_name || !payload.email || !payload.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }
    const response = await api.put(`/villagers/${villagerId}`, payload);
    console.log(`Updated villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteVillager = async (villagerId) => {
  try {
    const response = await api.delete(`/villagers/${villagerId}`);
    console.log(`Deleted villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const loginVillager = async (email, password) => {
  try {
    const response = await api.post("/villagers/login", { email, password });
    if (response.data && response.data.token) {
      setToken(response.data.token);
      console.log("Logged in villager, token set:", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/villagers/profile");
    console.log("Fetched profile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerStatus = async (villagerId, status) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/status`, { status });
    console.log(`Updated status for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerLocation = async (villagerId, latitude, longitude) => {
  try {
    const response = await api.put(`/villagers/${villagerId}/location`, { latitude, longitude });
    console.log(`Updated location for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating location for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getVillagerLocation = async (villagerId) => {
  try {
    const response = await api.get(`/villagers/${villagerId}/location`);
    console.log(`Fetched location for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error getting location for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestPasswordOtp = async (email) => {
  try {
    const response = await api.post("/villagers/request-otp", { email });
    console.log(`Requested OTP for email ${email}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error requesting OTP for email ${email}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const verifyPasswordOtp = async (villagerId, otp, newPassword) => {
  try {
    const response = await api.post(`/villagers/${villagerId}/verify-otp`, { otp, newPassword });
    console.log(`Verified OTP for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error verifying OTP for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const saveNotificationToAll = async (message) => {
  try {
    const response = await api.post("/notifications/all", { message });
    console.log("Notification sent to all:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification to all:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendNotification = async (villagerId, message) => {
  try {
    const response = await api.post("/notifications/single", { villagerId, message });
    console.log(`Notification sent to villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error sending notification to villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getVillagerNotifications = async () => {
  try {
    const response = await api.get("/villagers/notifications");
    console.log("Fetched villager notifications:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching villager notifications:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    console.log("Fetched all notifications:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all notifications:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    console.log(`Marked notification ${notificationId} as read:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestNewBorn = async (formData) => {
  try {
    const response = await api.post("/villagers/new-born-request", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("New born request submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting new born request:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestNewFamilyMember = async (formData) => {
  try {
    const response = await api.post("/villagers/new-family-member-request", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("New family member request submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting new family member request:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNewFamilyMemberRequests = async () => {
  try {
    const response = await api.get('/villagers/new-family-member-requests');
    console.log("Fetched new family member requests:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching new family member requests:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNewBornRequests = async () => {
  try {
    const response = await api.get('/villagers/new-born-requests');
    console.log("Fetched new born requests:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching new born requests:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    // Ensure only the filename is sent, removing any directory prefix
    const cleanFilename = filename.replace(/^Uploads[\\/]/, '');
    const response = await api.get(`/villagers/documents/${cleanFilename}`, { responseType: 'blob' });
    console.log(`Downloaded document ${cleanFilename}`);
    return response.data;
  } catch (error) {
    console.error(`Error downloading document ${filename}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillageTotal = async () => {
  try {
    const response = await api.get("/villagers/total");
    console.log("Fetched village total:", response.data);
    return response.data.total_villagers;
  } catch (error) {
    console.error("Error fetching village total:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const fetchVillageParticipantTotal = async () => {
  try {
    const response = await api.get("/villagers/participant-total");
    console.log("Fetched village participant total:", response.data);
    return response.data.participant_total;
  } catch (error) {
    console.error("Error fetching village participant total:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const fetchMonthlyRegistrationCount = async () => {
  try {
    const response = await api.get("/villagers/monthly-registration-count");
    console.log("Fetched monthly registration counts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly registration counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const fetchMonthlyVillagerGrowth = async () => {
  try {
    const response = await api.get("/villagers/monthly-growth");
    console.log("Fetched monthly villager growth:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly villager growth:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const fetchReligionCount = async () => {
  try {
    const response = await api.get("/villagers/religion-count");
    console.log("Fetched religion counts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching religion counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchRaceCount = async () => {
  try {
    const response = await api.get("/villagers/race-count");
    console.log("Fetched race counts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching race counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
export const fetchHouseCount = async () => {
  try {
    const response = await api.get("/villagers/house-count");
    console.log("Fetched house count:", response.data);
    return response.data.house_count;
  } catch (error) {
    console.error("Error fetching house count:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};