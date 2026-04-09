import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

// Response interceptor – normalise errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Events ──────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of events.
 * @param {{ page?: number, limit?: number, category?: string, search?: string }} params
 */
export const fetchEvents = (params = {}) =>
  apiClient.get("/events", { params }).then((res) => res.data);

/**
 * Fetch a single event by its ID.
 * @param {string|number} id
 */
export const fetchEventById = (id) =>
  apiClient.get(`/events/${id}`).then((res) => res.data);

// ── Orders ───────────────────────────────────────────────────────────────────

/**
 * Create a new order (checkout).
 * @param {{ eventId: string|number, quantity: number, customerDetails: object }} payload
 */
export const createOrder = (payload) =>
  apiClient.post("/orders", payload).then((res) => res.data);

/**
 * Fetch an order by its ID.
 * @param {string|number} id
 */
export const fetchOrderById = (id) =>
  apiClient.get(`/orders/${id}`).then((res) => res.data);

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * Log in a user.
 * @param {{ email: string, password: string }} credentials
 */
export const login = (credentials) =>
  apiClient.post("/auth/login", credentials).then((res) => res.data);

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 */
export const register = (data) =>
  apiClient.post("/auth/register", data).then((res) => res.data);

export default apiClient;
