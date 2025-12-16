import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.3:5000/api/nic-applications';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const fetchNICApplications = async () => {
  try {
    console.log('Fetching NIC applications');
    const response = await api.get('/');
    console.log('Fetched NIC applications:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching NIC applications:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchConfirmedNICApplications = async () => {
  try {
    console.log('Fetching confirmed NIC applications');
    const response = await api.get('/confirmed');
    console.log('Fetched confirmed NIC applications:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching confirmed NIC applications:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const updateNICApplicationStatus = async (villagerId: string, nicId: string, status: string) => {
  try {
    console.log(`Updating NIC application status for villager: ${villagerId}, NIC: ${nicId}, Status: ${status}`);
    if (!['Pending', 'Send', 'Rejected', 'Confirm'].includes(status)) {
      throw new Error("Invalid status. Must be 'Pending', 'Send', 'Rejected', or 'Confirm'");
    }
    const response = await api.put(`/${villagerId}/${nicId}/status`, { status });
    console.log('Status update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error updating NIC application status:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchVillagerDetails = async (villagerId: string) => {
  try {
    console.log(`Fetching villager details for ID: ${villagerId}`);
    const response = await api.get(`/villager/${villagerId}`);
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
    const response = await api.get(`/download/${filename}`, {
      responseType: 'blob',
    });
    console.log('Document download response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error downloading document ${filename}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};
