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

export const fetchAllowances = async () => {
  try {
    console.log('Fetching allowances from:', `${API_URL}/allowances/`);
    const response = await api.get('/allowances/');
    console.log('Fetched allowances:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching allowances:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchAllowance = async (allowanceId: string) => {
  try {
    console.log(`Fetching allowance ${allowanceId} from:`, `${API_URL}/allowances/${allowanceId}`);
    const response = await api.get(`/allowances/${allowanceId}`);
    console.log(`Fetched allowance ${allowanceId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching allowance ${allowanceId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const checkVillagerAllowanceApplication = async (villagerId: string) => {
  try {
    console.log(`Checking allowance applications for villager ${villagerId} from:`, `${API_URL}/allowances/check-application`);
    const response = await api.post('/allowances/check-application', { villagerId });
    console.log(`Fetched allowance applications for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error checking allowance applications for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const submitAllowanceApplication = async (formData: FormData) => {
  try {
    const response = await api.post('/allowance-applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Allowance application submitted:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting allowance application:', error);
    throw error.response ? error.response.data : error.message;
  }
};
