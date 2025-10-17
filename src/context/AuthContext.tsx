import React, { useState, useEffect } from 'react';
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
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    email: string,
    password: string,
    full_name: string,
    phone: string,
    role?: StaffRole
  ) => Promise<AuthResult>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: () => boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
export { AuthContext as LocalAuthContext };

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const parsedUser: Staff = JSON.parse(userData);
        setUser({
          staff_id: parsedUser.staff_id,
          email: parsedUser.email,
          name: parsedUser.full_name,
          role: parsedUser.role,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);

      const response = await authAPI.login({ email, password });
      
      const userObj: User = {
        staff_id: response.user.staff_id,
        email: response.user.email,
        name: response.user.full_name,
        role: response.user.role,
      };

      setUser(userObj);
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

      const userObj: User = {
        staff_id: response.user.staff_id,
        email: response.user.email,
        name: response.user.full_name,
        role: response.user.role,
      };

      setUser(userObj);
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
  };

  const isAdmin = (): boolean => {
    return user?.role === StaffRole.OWNER;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    isAdmin,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};