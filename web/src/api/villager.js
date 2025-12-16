import axios from "axios";
import { getToken, setToken } from "../utils/auth";

const API_URL = "http://172.20.10.3:5000/api";

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
    const formData = new FormData();
    formData.append("villager_id", newVillager.villager_id || "");
    formData.append("full_name", newVillager.full_name || "");
    formData.append("email", newVillager.email || "");
    formData.append("password", newVillager.password || "");
    formData.append("phone_no", newVillager.phone_no || "");
    formData.append("nic", newVillager.nic || "");
    formData.append("dob", newVillager.dob || "");
    formData.append("address", newVillager.address || "");
    formData.append("regional_division", newVillager.regional_division || "");
    formData.append("status", newVillager.status || "Active");
    formData.append("area_id", newVillager.area_id || "");
    formData.append("latitude", newVillager.latitude || "");
    formData.append("longitude", newVillager.longitude || "");
    formData.append("is_election_participant", Boolean(newVillager.is_election_participant));
    formData.append("alive_status", newVillager.alive_status || "Alive");
    formData.append("job", newVillager.job || "");
    formData.append("gender", newVillager.gender || "Other");
    formData.append("marital_status", newVillager.marital_status || "Unmarried");
    formData.append("religion", newVillager.religion || "Others");
    formData.append("race", newVillager.race || "Sinhalese");

    if (newVillager.birthCertificate) {
      formData.append("birthCertificate", newVillager.birthCertificate);
    }
    if (newVillager.nicCopy) {
      formData.append("nicCopy", newVillager.nicCopy);
    }

    if (!newVillager.villager_id || !newVillager.full_name || !newVillager.email || !newVillager.password || !newVillager.phone_no) {
      throw new Error("Villager ID, Full Name, Email, Password, and Phone Number are required");
    }

    const response = await api.post("/villagers", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log("Added villager:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding villager:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillager = async (villagerId, updatedVillager) => {
  try {
    const formData = new FormData();
    formData.append("full_name", updatedVillager.full_name || "");
    formData.append("email", updatedVillager.email || "");
    formData.append("phone_no", updatedVillager.phone_no || "");
    formData.append("address", updatedVillager.address !== undefined ? updatedVillager.address : "");
    formData.append("regional_division", updatedVillager.regional_division !== undefined ? updatedVillager.regional_division : "");
    formData.append("status", updatedVillager.status || "Active");
    formData.append("is_election_participant", Boolean(updatedVillager.is_election_participant));
    formData.append("alive_status", updatedVillager.alive_status || "Alive");
    formData.append("job", updatedVillager.job !== undefined ? updatedVillager.job : "");
    formData.append("gender", updatedVillager.gender || "Other");
    formData.append("marital_status", updatedVillager.marital_status || "Unmarried");
    formData.append("dob", updatedVillager.dob || "");
    formData.append("religion", updatedVillager.religion || "Others");
    formData.append("race", updatedVillager.race || "Sinhalese");

    if (updatedVillager.birthCertificate) {
      formData.append("birthCertificate", updatedVillager.birthCertificate);
    }
    if (updatedVillager.nicCopy) {
      formData.append("nicCopy", updatedVillager.nicCopy);
    }

    if (!updatedVillager.full_name || !updatedVillager.email || !updatedVillager.phone_no) {
      throw new Error("Full Name, Email, and Phone Number are required");
    }

    const response = await api.put(`/villagers/${villagerId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log(`Updated villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : new Error(error.message || 'Unknown error');
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

export const verifyPasswordOtp = async (villagerId, otp, newPassword, isBackupCode = false) => {
  try {
    const response = await api.post(`/villagers/${villagerId}/verify-otp`, { otp, newPassword, isBackupCode });
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
    // Ensure filename is sanitized
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const response = await api.get(`/villagers/documents/${cleanFilename}`, {
      responseType: 'blob',
    });
    if (!response.data || response.data.size === 0) {
      throw new Error('Empty or invalid document received');
    }
    console.log(`Downloaded document ${cleanFilename}`);
    return response.data;
  } catch (error) {
    console.error(`Error downloading document ${filename}:`, error.response || error.message);
    throw error.response ? { error: error.response.data.error || 'Failed to download document' } : { error: error.message };
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

export const updateVillagerDocuments = async (formData) => {
  try {
    const response = await api.post("/villagers/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log("Uploaded documents:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading documents:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
  
};
