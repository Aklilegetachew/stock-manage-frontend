import axios from "axios"

// Centralized axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Optional: Add interceptors here (auth, logging, etc.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error)
    return Promise.reject(error)
  }
)

export default api
