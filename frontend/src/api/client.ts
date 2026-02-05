import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

type RetriableRequest = AxiosRequestConfig & { _retry?: boolean };

const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
};

const isJwtExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return true;
    const { exp } = JSON.parse(atob(payload));
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (isJwtExpired(token)) {
      clearTokens();
    } else {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequest | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      // Try to refresh the access token if we have a valid refresh token
      if (refresh && !isJwtExpired(refresh)) {
        try {
          const { data } = await axios.post(`${API_BASE_URL.replace(/\/$/, "")}/auth/refresh/`, { refresh });
          if (data?.access) {
            localStorage.setItem("token", data.access);
            api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return api(originalRequest);
          }
        } catch {
          // fall through to clear tokens and retry without Authorization
        }
      }

      clearTokens();
      if (originalRequest.headers && "Authorization" in originalRequest.headers) {
        delete (originalRequest.headers as Record<string, unknown>).Authorization;
      }
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
