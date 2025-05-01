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
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch all elections (GET /elections/)
export const fetchElections = async () => {
  try {
    const response = await api.get("/elections/");
    return response.data;
  } catch (error) {
    console.error("Error fetching elections:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch a single election by ID (GET /elections/:id)
export const fetchElection = async (electionId) => {
  try {
    const response = await api.get(`/elections/${electionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching election ${electionId}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};