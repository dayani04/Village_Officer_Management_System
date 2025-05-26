import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/nic-applications';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const submitNICApplication = async (formData) => {
  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting NIC application:', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchNICApplications = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching NIC applications:', error);
    throw error.response ? error.response.data : error.message;
  }
};

// src/api/nicApplication.js (relevant part)
export const updateNICApplicationStatus = async (villagerId, nicId, status) => {
  try {
    const response = await api.put(`/${villagerId}/${nicId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating NIC application status:', error);
    throw error.response ? error.response.data : error.message;
  }
};

export const downloadDocument = async (filename) => {
  try {
    const response = await api.get(`/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error.response ? error.response.data : error.message;
  }
};