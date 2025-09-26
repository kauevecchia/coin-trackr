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
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Login failed. Please check your credentials.";
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
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Registration failed.";
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
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Logout failed.";
      setError(errorMessage);
      setUnauthenticated();
      throw error;
    }
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedUser } : null,
    }));
  }, []);

  const checkSession = useCallback(async (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
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
        throw new Error("Token expired");
      }

      const user = authService.getUserFromToken(storedToken);
      
      // if token is close to expiring (less than 5 minutes), try to refresh
      const tokenExp = JSON.parse(atob(storedToken.split('.')[1])).exp;
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = tokenExp - currentTime;

      if (timeUntilExpiry < 300) { // less than 5 minutes
        try {
          const { user: refreshedUser } = await authService.refreshToken();
          setAuthenticated(refreshedUser);
        } catch {
          // if refresh fails, the token is probably invalid
          authService.clearStoredToken();
          setUnauthenticated();
          throw new Error("Session expired");
        }
      } else {
        setAuthenticated(user);
      }
    } catch (error: unknown) {
      authService.clearStoredToken();
      const errorMessage = (error as { message?: string }).message || "Session expired. Please log in again.";
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
    updateUser,
  };
}; 