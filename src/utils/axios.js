import axios from "axios";
import { useAuth } from "../components/Auth/AuthContext";

// Base URL for your backend
const BASE_URL = "http://localhost:5000"; // change if different

// Public Axios instance (no auth header)
export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create the privateAxios instance
export const privateAxios = axios.create({
  baseURL: BASE_URL
});

// Function to attach token manually (optional, for special cases)
export const attachPrivateAxios = (token) => {
  if (token) {
    privateAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete privateAxios.defaults.headers.common["Authorization"];
  }
};

// Automatically attach token from localStorage on every request
privateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);
