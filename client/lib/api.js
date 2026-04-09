/**
 * API client for communicating with the Go backend.
 *
 * Set the NEXT_PUBLIC_API_URL environment variable to point to your backend.
 * Example: NEXT_PUBLIC_API_URL=http://localhost:8080
 */

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor – attach auth token when available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

// ─── Events ─────────────────────────────────────────────────────────────────

/** Fetch all events with optional filters. */
export const getEvents = (params = {}) =>
  apiClient.get("/api/events", { params }).then((res) => res.data);

/** Fetch a single event by ID. */
export const getEvent = (id) =>
  apiClient.get(`/api/events/${id}`).then((res) => res.data);

// ─── Orders ──────────────────────────────────────────────────────────────────

/** Create a new order / checkout session. */
export const createOrder = (orderData) =>
  apiClient.post("/api/orders", orderData).then((res) => res.data);

/** Get a specific order by ID. */
export const getOrder = (id) =>
  apiClient.get(`/api/orders/${id}`).then((res) => res.data);

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Register a new user. */
export const register = (userData) =>
  apiClient.post("/api/auth/register", userData).then((res) => res.data);

/** Log in and receive a JWT token. */
export const login = (credentials) =>
  apiClient.post("/api/auth/login", credentials).then((res) => res.data);

export default apiClient;
