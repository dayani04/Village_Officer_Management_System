import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.3:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added token to request:', token);
    } else {
      console.warn('No token found for request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchElectionApplications = async () => {
  try {
    const response = await api.get('/election-applications/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching election applications:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const updateElectionApplicationStatus = async (villagerId: string, electionrecodeID: string, status: string) => {
  try {
    if (!status) {
      throw new Error('Status is required');
    }
    const response = await api.put(`/election-applications/${villagerId}/${electionrecodeID}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating election application status for ${villagerId}, ${electionrecodeID}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchVillagerDetails = async (villagerId: string) => {
  try {
    console.log(`Fetching villager details for ID: ${villagerId}`);
    const response = await api.get(`/villagers/${villagerId}`);
    console.log('Villager details response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching villager details for ID ${villagerId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const downloadDocument = async (filename: string) => {
  try {
    console.log(`Downloading document: ${filename}`);
    const response = await api.get(`/election-applications/download/${filename}`, {
      responseType: 'blob',
    });
    console.log('Document download response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading document ${filename}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const saveNotification = async (villagerId: string, message: string) => {
  try {
    const response = await api.post("/election-applications/notifications/", { villagerId, message });
    return response.data;
  } catch (error: any) {
    console.error("Error saving notification:", error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};
