import { create } from "zustand";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
}

interface ApiErrorResponse {
  message: string;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
  withCredentials: true,
});

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  accessToken: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/sessions", { email, password });
      const { token } = response.data;

      localStorage.setItem("accessToken", token);

      const decodedToken: DecodedToken = jwtDecode(token);

      const userName =
        decodedToken.name ||
        (decodedToken.email ? decodedToken.email.split("@")[0] : "User");
      const userEmail = decodedToken.email || email;

      const user: User = {
        id: decodedToken.sub,
        email: userEmail,
        name: userName,
      };

      set({
        isAuthenticated: true,
        user,
        accessToken: token,
        isLoading: false,
      });
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Login failed. Please check your credentials.";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw err;
    }
  },

  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });

      await api.post("/users", { name, email, password });

      await get().login(email, password);

      set({ isLoading: false });
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Registration failed.";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      localStorage.removeItem("accessToken");

      await api.post("/logout");

      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
      });
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Logout failed.";
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
      });
      throw err;
    }
  },

  checkSession: async () => {
    set({ isLoading: true, error: null });

    try {
      const storedAccessToken = localStorage.getItem("accessToken");

      if (!storedAccessToken) {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
        });
        return;
      }

      if (isTokenExpired(storedAccessToken)) {
        localStorage.removeItem("accessToken");
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
        });
        return;
      }

      const decodedToken: DecodedToken = jwtDecode(storedAccessToken);

      const userName =
        decodedToken.name ||
        (decodedToken.email ? decodedToken.email.split("@")[0] : "User");
      const userEmail = decodedToken.email || "unknown@example.com";

      const user: User = {
        id: decodedToken.sub,
        email: userEmail,
        name: userName,
      };

      set({ isAuthenticated: true, user, accessToken: storedAccessToken });

      try {
        const response = await api.post("/token/refresh");
        const { token: newAccessToken } = response.data;

        localStorage.setItem("accessToken", newAccessToken);

        const newDecodedToken: DecodedToken = jwtDecode(newAccessToken);
        
        const newUserName =
          newDecodedToken.name ||
          (newDecodedToken.email
            ? newDecodedToken.email.split("@")[0]
            : "User");
        const newuserEmail = newDecodedToken.email || "unknown@example.com";

        const updatedUser: User = {
          id: newDecodedToken.sub,
          email: newuserEmail,
          name: newUserName,
        };

        set({
          isAuthenticated: true,
          user: updatedUser,
          accessToken: newAccessToken,
          isLoading: false,
        });
      } catch (refreshError) {
        set({ isLoading: false });
        console.warn(
          "Token refresh failed, but user remains authenticated:",
          refreshError
        );
      }
    } catch (err) {
      localStorage.removeItem("accessToken");
      const axiosError = err as AxiosError<ApiErrorResponse>;
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error:
          axiosError.response?.data?.message ||
          "Session expired. Please log in again.",
        accessToken: null,
      });
      throw err;
    }
  },
}));

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && !isTokenExpired(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== "/token/refresh"
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await useAuthStore.getState().checkSession();
        const newToken = useAuthStore.getState().accessToken;

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        } else {
          processQueue(new Error("No token available"), null);
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
