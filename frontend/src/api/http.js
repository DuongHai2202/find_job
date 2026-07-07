import axios from "axios";

import { env } from "@/config/env";
import { clearStoredSession, getStoredAccessToken } from "@/lib/storage";

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession();
    }

    return Promise.reject(error);
  }
);
