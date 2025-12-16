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

export const fetchPermitApplications = async () => {
  try {
    const response = await api.get('/permit-applications/');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching permit applications:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const updatePermitApplicationStatus = async (villagerId: string, permitsId: string, status: string) => {
  try {
    if (!status) {
      throw new Error('Status is required');
    }
    console.log('Sending status update:', { villagerId, permitsId, status });
    const response = await api.put(`/permit-applications/${villagerId}/${permitsId}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error(`Error updating permit application status for ${villagerId}, ${permitsId}:`, error);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchConfirmedPermitApplications = async () => {
  try {
    const response = await api.get('/permit-applications/confirmed');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching confirmed permit applications:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const downloadDocument = async (filename: string) => {
  try {
    const response = await api.get(`/permit-applications/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading document ${filename}:`, error);
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

export const saveNotification = async (villagerId: string, message: string) => {
  try {
    const response = await api.post('/permit-applications/notifications/', { villagerId, message });
    return response.data;
  } catch (error: any) {
    console.error('Error saving notification:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};
