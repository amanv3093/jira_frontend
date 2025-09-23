import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "api-key": process.env.NEXT_PUBLIC_API_KEY, // keep your real API key
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  // Skip token for admin login
  if (!config.url?.endsWith("/admin/login")) {
    const session = await getSession();
    const token = session?.user.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
