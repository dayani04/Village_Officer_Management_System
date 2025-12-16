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

export const fetchElections = async () => {
  try {
    console.log('Fetching elections from:', `${API_URL}/elections/`);
    const response = await api.get('/elections/');
    console.log('Fetched elections:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching elections:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchElection = async (electionId: string) => {
  try {
    console.log(`Fetching election ${electionId} from:`, `${API_URL}/elections/${electionId}`);
    const response = await api.get(`/elections/${electionId}`);
    console.log(`Fetched election ${electionId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching election ${electionId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const checkVillagerElectionApplication = async (villagerId: string, electionType: string) => {
  try {
    console.log(`Checking applications for villager ${villagerId} for election type ${electionType} from:`, `${API_URL}/elections/check-application`);
    const response = await api.post('/elections/check-application', { villagerId, electionType });
    console.log(`Fetched applications for villager ${villagerId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error checking applications for villager ${villagerId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchElectionNotifications = async () => {
  try {
    console.log('Fetching election notifications from:', `${API_URL}/election-notifications/`);
    const response = await api.get('/election-notifications/');
    console.log('Fetched election notifications:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching election notifications:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteElectionNotification = async (notificationId: string) => {
  try {
    console.log(`Deleting election notification ${notificationId} from:`, `${API_URL}/election-notifications/${notificationId}`);
    const response = await api.delete(`/election-notifications/${notificationId}`);
    console.log(`Deleted election notification ${notificationId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error deleting election notification ${notificationId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const sendElectionNotification = async (electionType: string, message: string) => {
  try {
    const response = await api.post('/election-notifications', { electionType, message });
    console.log('Election notification sent:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending election notification:', error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const submitElectionApplication = async (formData: FormData) => {
  try {
    const response = await api.post('/election-applications/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error submitting election application:', error);
    throw error.response ? error.response.data : error.message;
  }
};