'use client'

import { useState, useEffect, useCallback } from "react";
import { authService, User } from "../services/auth.service";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const setLoading = (loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  };

  const setAuthenticated = (user: User) => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      isLoading: false,
      error: null,
    }));
  };

  const setUnauthenticated = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  };

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user } = await authService.login(email, password);
      setAuthenticated(user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      setUnauthenticated();
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.register(name, email, password);
      await login(email, password);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Registration failed.";
      setError(errorMessage);
      setUnauthenticated();
      throw error;
    }
  }, [login]);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.logout();
      setUnauthenticated();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Logout failed.";
      setError(errorMessage);
      setUnauthenticated();
      throw error;
    }
  }, []);

  const checkSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const storedToken = authService.getStoredToken();

      if (!storedToken) {
        setUnauthenticated();
        return;
      }

      if (!authService.isTokenValid(storedToken)) {
        authService.clearStoredToken();
        setUnauthenticated();
        return;
      }

      const user = authService.getUserFromToken(storedToken);
      setAuthenticated(user);

      try {
        const { user: refreshedUser } = await authService.refreshToken();
        setAuthenticated(refreshedUser);
      } catch (refreshError) {
        console.warn("Token refresh failed, but user remains authenticated:", refreshError);
        setLoading(false);
      }
    } catch (error: any) {
      authService.clearStoredToken();
      const errorMessage = error.response?.data?.message || "Session expired. Please log in again.";
      setError(errorMessage);
      setUnauthenticated();
      throw error;
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    ...authState,
    login,
    register,
    logout,
    checkSession,
  };
}; 