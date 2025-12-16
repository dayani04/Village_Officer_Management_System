import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://172.20.10.3:5000/api/certificate-applications';

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

export const submitCertificateApplication = async (formData: FormData) => {
  try {
    console.log('Submitting certificate application');
    const response = await api.post('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Submit certificate application response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting certificate application:', error.response?.data || error.message);
    throw error.response?.data?.error || 'An unexpected error occurred during submission.';
  }
};

export const fetchCertificateApplications = async () => {
  try {
    console.log('Fetching certificate applications');
    const response = await api.get('/');
    console.log('Fetched certificate applications:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching certificate applications:', error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const updateCertificateApplicationStatus = async (applicationId: string, status: string) => {
  try {
    console.log(`Sending status update request for application ID: ${applicationId}, Status: ${status}`);
    if (!['Pending', 'Send', 'Rejected', 'Confirm'].includes(status)) {
      throw new Error("Invalid status. Must be 'Pending', 'Send', 'Rejected', or 'Confirm'");
    }
    const response = await api.put(`/${applicationId}/status`, { status });
    console.log(`Status update response for application ID ${applicationId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error updating status for certificate application ${applicationId}:`, error.response?.data || error.message);
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

export const fetchNotifications = async (villagerId: string) => {
  try {
    console.log(`Fetching notifications for villager ID: ${villagerId}`);
    const response = await api.get(`/notifications/${villagerId}`);
    console.log('Notifications response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching notifications for villager ID ${villagerId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const fetchApplicationDetails = async (applicationId: string) => {
  try {
    console.log(`Fetching application details for ID: ${applicationId}`);
    const response = await api.get(`/application/${applicationId}`);
    console.log('Application details response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching application details for ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const uploadCertificate = async (applicationId: string, file: any) => {
  try {
    console.log(`Uploading certificate for application ID: ${applicationId}`);
    const formData = new FormData();
    formData.append('certificate', file);
    const response = await api.post(`/upload-certificate/${applicationId}`, formData);
    console.log('Upload certificate response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error uploading certificate for application ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const saveCertificatePath = async (applicationId: string, formData: FormData) => {
  try {
    console.log(`Saving certificate for application ID: ${applicationId}`);
    const response = await api.post(`/certificate-applications/save-certificate/${applicationId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Save certificate response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error saving certificate for ID ${applicationId}:`, error.response?.data || error.message);
    throw error.response?.data?.error || error.message;
  }
};

export const checkRecentApplication = async (email: string) => {
  try {
    console.log(`Checking recent applications for email: ${email}`);
    const response = await api.post('/check-recent', { email });
    console.log('Recent application check response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(`Error checking recent applications for email ${email}:`, error.response?.data || error.message);
    throw error.response?.data?.error || 'An unexpected error occurred while checking recent applications.';
  }
};

export const fetchUserConfirmedCertificates = async () => {
  try {
    console.log("Fetching user's confirmed certificates");
    const response = await api.get('/user-confirmed-certificates');
    console.log('Fetched user confirmed certificates:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user confirmed certificates:', error.response?.data || error.message);
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
