import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import { Staff, StaffRole } from '../types';

export type AuthResult = {
  success: boolean;
  error?: string;
};

export interface User {
  staff_id: number;
  email: string;
  name: string;
  role: StaffRole;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: Staff, token: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<AuthResult>;
  register: (
    email: string,
    password: string,
    full_name: string,
    phone: string,
    role?: StaffRole
  ) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
  isAdmin: () => boolean;
  getCurrentUser: () => User | null;
  refreshAfterLogin: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
export { AuthContext as LocalAuthContext };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (storedToken && userData) {
      try {
        const parsedUser: Staff = JSON.parse(userData);
        setUser({
          staff_id: parsedUser.staff_id,
          email: parsedUser.email,
          name: parsedUser.full_name,
          role: parsedUser.role,
        });
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((staff: Staff, accessToken: string) => {
    setUser({
      staff_id: staff.staff_id,
      email: staff.email,
      name: staff.full_name,
      role: staff.role,
    });
    setToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(staff));
  }, []);

  const loginWithCredentials = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      login(response.user, response.access_token);
      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError?.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    full_name: string,
    phone: string,
    role: StaffRole = StaffRole.STAFF
  ): Promise<AuthResult> => {
    try {
      setLoading(true);

      const response = await authAPI.register({
        email,
        password,
        full_name,
        phone,
        role,
      });
      login(response.user, response.access_token);
      return { success: true };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError?.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const isAdmin = (): boolean => user?.role === StaffRole.OWNER;

  const isAuthenticated = useCallback(() => !!user && !!token, [user, token]);

  const getCurrentUser = useCallback(() => user, [user]);

  const refreshAfterLogin = useCallback(() => {
  }, []);

  const value: AuthContextType = {
    user,
    token,
    login,
    loginWithCredentials,
    register,
    logout,
    isAuthenticated,
    loading,
    isAdmin,
    getCurrentUser,
    refreshAfterLogin,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};