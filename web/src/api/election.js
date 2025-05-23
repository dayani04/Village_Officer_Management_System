// src/api/election.js
import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/api";

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

export const fetchElections = async () => {
  try {
    console.log("Fetching elections from:", `${API_URL}/elections/`);
    const response = await api.get("/elections/");
    console.log("Fetched elections:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching elections:", error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchElection = async (electionId) => {
  try {
    console.log(`Fetching election ${electionId} from:`, `${API_URL}/elections/${electionId}`);
    const response = await api.get(`/elections/${electionId}`);
    console.log(`Fetched election ${electionId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching election ${electionId}:`, error.response || error.message);
    throw error.response ? error.response.data : error.message;
  }
};