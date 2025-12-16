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
  } catch (error: any) {
    console.error("Error fetching villagers:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillager = async (villagerId: string) => {
  try {
    const response = await api.get(`/villagers/${villagerId}`);
    console.log(`Fetched villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const addVillager = async (newVillager: any) => {
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
    formData.append("is_election_participant", String(Boolean(newVillager.is_participant)));
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
  } catch (error: any) {
    console.error("Error adding villager:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const loginVillager = async (email: string, password: string) => {
  try {
    const response = await api.post("/villagers/login", { email, password });
    if (response.data && response.data.token) {
      await AsyncStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerDocuments = async (formData: FormData) => {
  try {
    console.log('Uploading documents with FormData');
    
    const response = await api.post("/villagers/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log("Uploaded documents:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error uploading documents:", error.response || error.message);
    let errorMessage = 'Failed to upload documents';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    throw { error: errorMessage };
  }
};

export const downloadDocument = async (filename: string) => {
  try {
    // Ensure filename is sanitized
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    console.log(`Downloading document: ${cleanFilename}`);
    
    const response = await api.get(`/villagers/documents/${cleanFilename}`, {
      responseType: 'blob',
    });
    
    if (!response.data || response.data.size === 0) {
      throw new Error('Empty or invalid document received');
    }
    
    console.log(`Downloaded document ${cleanFilename}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading document ${filename}:`, error.response || error.message);
    let errorMessage = 'Failed to download document';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    throw { error: errorMessage };
  }
};

export const requestNewBorn = async (formData: FormData) => {
  try {
    const response = await api.post("/villagers/new-born-request", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("New born request submitted:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error submitting new born request:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const requestNewFamilyMember = async (formData: FormData) => {
  try {
    const response = await api.post("/villagers/new-family-member-request", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("New family member request submitted:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error submitting new family member request:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNewFamilyMemberRequests = async () => {
  try {
    const response = await api.get('/villagers/new-family-member-requests');
    console.log("Fetched new family member requests:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching new family member requests:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNewBornRequests = async () => {
  try {
    const response = await api.get('/villagers/new-born-requests');
    console.log("Fetched new born requests:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching new born requests:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getVillagerNotifications = async () => {
  try {
    const response = await api.get("/villagers/notifications");
    console.log("Fetched villager notifications:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching villager notifications:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    console.log(`Marked notification ${notificationId} as read:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error marking notification ${notificationId} as read:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    console.log("Fetched all notifications:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all notifications:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillagerLocation = async (villagerId: string, latitude: number, longitude: number) => {
  try {
    console.log('updateVillagerLocation called with:', { villagerId, latitude, longitude });
    
    if (!villagerId || !latitude || !longitude) {
      console.error('Missing required parameters:', { villagerId, latitude, longitude });
      throw { error: 'Latitude and Longitude are required' };
    }

    const locationData = { latitude, longitude };

    console.log(`Updating location for villager ${villagerId}:`, locationData);
    
    const response = await api.put(`/villagers/${villagerId}/location`, locationData);
    console.log(`Updated location for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating location for villager ${villagerId}:`, error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    
    let errorMessage = 'Failed to update location';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw { error: errorMessage };
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/villagers/profile");
    console.log("Fetched profile:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateVillager = async (villagerId: string, updateData: any) => {
  try {
    console.log('Starting updateVillager with data:', updateData);
    
    // Create FormData for React Native compatibility - match web version exactly
    const formData = new FormData();
    
    // Format date for MySQL DATE column (YYYY-MM-DD)
    let formattedDob = updateData.dob || "";
    if (updateData.dob && updateData.dob.includes('T')) {
      // Convert ISO string to YYYY-MM-DD format
      formattedDob = new Date(updateData.dob).toISOString().split('T')[0];
    }
    
    // Append all fields to FormData exactly like the web version
    formData.append("full_name", updateData.full_name || "");
    formData.append("email", updateData.email || "");
    formData.append("phone_no", updateData.phone_no || "");
    formData.append("address", updateData.address !== undefined ? updateData.address : "");
    formData.append("regional_division", updateData.regional_division !== undefined ? updateData.regional_division : "");
    formData.append("status", updateData.status || "Active");
    
    // Handle boolean specially for React Native FormData
    const booleanValue = String(Boolean(updateData.is_election_participant));
    formData.append("is_election_participant", booleanValue);
    
    formData.append("alive_status", updateData.alive_status || "Alive");
    formData.append("job", updateData.job !== undefined ? updateData.job : "");
    formData.append("gender", updateData.gender || "Other");
    formData.append("marital_status", updateData.marital_status || "Unmarried");
    formData.append("dob", formattedDob);
    
    // Ensure religion and race are valid enum values
    const religion = updateData.religion || 'Others';
    const race = updateData.race || 'Sinhalese';
    
    formData.append("religion", religion);
    formData.append("race", race);

    console.log(`Updating villager ${villagerId} with FormData`);
    console.log('Final FormData values:');
    console.log('- full_name:', updateData.full_name);
    console.log('- email:', updateData.email);
    console.log('- phone_no:', updateData.phone_no);
    console.log('- dob (original):', updateData.dob);
    console.log('- dob (formatted):', formattedDob);
    console.log('- is_election_participant:', booleanValue);
    console.log('- religion:', religion);
    console.log('- race:', race);
    
    const response = await api.put(`/villagers/${villagerId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    console.log(`Updated villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating villager ${villagerId}:`, error);
    console.error('Error response:', error.response);
    console.error('Error data:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Full error object:', JSON.stringify(error, null, 2));
    
    // Extract the actual error message
    let errorMessage = 'Failed to update profile';
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw { error: errorMessage };
  }
};

export const deleteVillager = async (villagerId: string) => {
  try {
    const response = await api.delete(`/villagers/${villagerId}`);
    console.log(`Deleted villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillageTotal = async () => {
  try {
    const response = await api.get("/villagers/total");
    console.log("Fetched village total:", response.data);
    return response.data.total_villagers;
  } catch (error: any) {
    console.error("Error fetching village total:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchVillageParticipantTotal = async () => {
  try {
    const response = await api.get("/villagers/participant-total");
    console.log("Fetched village participant total:", response.data);
    return response.data.participant_total;
  } catch (error: any) {
    console.error("Error fetching village participant total:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchHouseCount = async () => {
  try {
    const response = await api.get("/villagers/house-count");
    console.log("Fetched house count:", response.data);
    return response.data.house_count;
  } catch (error: any) {
    console.error("Error fetching house count:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchMonthlyRegistrationCount = async () => {
  try {
    const response = await api.get("/villagers/monthly-registration-count");
    console.log("Fetched monthly registration counts:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching monthly registration counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchMonthlyVillagerGrowth = async () => {
  try {
    const response = await api.get("/villagers/monthly-growth");
    console.log("Fetched monthly villager growth:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching monthly villager growth:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchReligionCount = async () => {
  try {
    const response = await api.get("/villagers/religion-count");
    console.log("Fetched religion counts:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching religion counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchRaceCount = async () => {
  try {
    const response = await api.get("/villagers/race-count");
    console.log("Fetched race counts:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching race counts:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendNotification = async (villagerId: string, message: string) => {
  try {
    const response = await api.post("/notifications/single", { villagerId, message });
    console.log(`Notification sent to villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error sending notification to villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadNewBornDocument = async (filename: string) => {
  try {
    const response = await api.get(`/villagers/new-born-request/download/${filename}`, {
      responseType: 'blob',
    });
    
    // Check if the response is actually an HTML error page
    if (response.data.type === 'text/html') {
      const text = await response.data.text();
      console.error('Server returned HTML instead of file:', text.substring(0, 200));
      throw new Error('Document not found on server. The file may have been moved or deleted.');
    }
    
    if (!response.data || response.data.size === 0) {
      throw new Error('Empty or invalid document received from server');
    }
    
    console.log(`Downloaded new born document ${filename}, size: ${response.data.size} bytes, type: ${response.data.type}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading new born document ${filename}:`, error.response || error.message);
    
    // Provide more specific error messages
    if (error.response?.status === 404) {
      throw new Error('Document not found on server');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to download this document');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while downloading document');
    } else {
      throw error.response ? error.response.data : error.message || 'Failed to download document';
    }
  }
};

export const downloadNewFamilyMemberDocument = async (filename: string) => {
  try {
    const response = await api.get(`/villagers/new-family-member-request/download/${filename}`, {
      responseType: 'blob',
    });
    
    // Check if the response is actually an HTML error page
    if (response.data.type === 'text/html') {
      const text = await response.data.text();
      console.error('Server returned HTML instead of file:', text.substring(0, 200));
      throw new Error('Document not found on server. The file may have been moved or deleted.');
    }
    
    if (!response.data || response.data.size === 0) {
      throw new Error('Empty or invalid document received from server');
    }
    
    console.log(`Downloaded new family member document ${filename}, size: ${response.data.size} bytes, type: ${response.data.type}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading new family member document ${filename}:`, error.response || error.message);
    
    // Provide more specific error messages
    if (error.response?.status === 404) {
      throw new Error('Document not found on server');
    } else if (error.response?.status === 403) {
      throw new Error('You do not have permission to download this document');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred while downloading document');
    } else {
      throw error.response ? error.response.data : error.message || 'Failed to download document';
    }
  }
};
