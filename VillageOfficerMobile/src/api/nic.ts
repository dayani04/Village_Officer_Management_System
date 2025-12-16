import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.3:5000/api';

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

export const fetchNICs = async () => {
  try {
    const response = await api.get('/nics/');
    console.log('Fetched NIC types:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching NIC types:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNIC = async (nicId: string) => {
  try {
    const response = await api.get(`/nics/${nicId}`);
    console.log(`Fetched NIC ${nicId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching NIC ${nicId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const submitNICApplication = async (formData: FormData) => {
  try {
    console.log('Submitting NIC application');
    const response = await api.post('/nic-applications/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('NIC application submitted:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting NIC application:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};
