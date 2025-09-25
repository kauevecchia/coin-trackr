import { jwtDecode } from "jwt-decode";
import { api, isTokenExpired } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface DecodedToken {
  sub: string;
  email?: string;
  name?: string;
  exp: number;
}

interface LoginResponse {
  token: string;
}

interface RefreshResponse {
  token: string;
}

const decodeTokenToUser = (token: string): User => {
  const decodedToken: DecodedToken = jwtDecode(token);
  
  const userName =
    decodedToken.name ||
    (decodedToken.email ? decodedToken.email.split("@")[0] : "User");
  const userEmail = decodedToken.email || "unknown@example.com";

  return {
    id: decodedToken.sub,
    email: userEmail,
    name: userName,
  };
};

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post<LoginResponse>("/sessions", { email, password });
    const { token } = response.data;

    localStorage.setItem("accessToken", token);
    const user = decodeTokenToUser(token);

    return { user, token };
  },

  async register(name: string, email: string, password: string): Promise<void> {
    await api.post("/users", { name, email, password });
  },

  async logout(): Promise<void> {
    localStorage.removeItem("accessToken");
    await api.post("/logout");
  },

  async refreshToken(): Promise<{ user: User; token: string }> {
    const response = await api.post<RefreshResponse>("/token/refresh");
    const { token } = response.data;

    localStorage.setItem("accessToken", token);
    const user = decodeTokenToUser(token);

    return { user, token };
  },

  getStoredToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  isTokenValid(token: string): boolean {
    return !isTokenExpired(token);
  },

  getUserFromToken(token: string): User {
    return decodeTokenToUser(token);
  },

  clearStoredToken(): void {
    localStorage.removeItem("accessToken");
  }
}; 