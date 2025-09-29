import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type AuthResult = {
  success: boolean;
  error?: string;
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
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
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!email || !password) {
        return { success: false, error: 'Missing credentials' };
      }

      const mockUser: User = {
        id: '1',
        email,
        name: 'Test User',
        role: email === 'admin@example.com' ? 'admin' : 'user',
      };

      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error: unknown) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResult> => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!email || !password || !firstName || !lastName) {
        return { success: false, error: 'Missing registration fields' };
      }

      const mockUser: User = {
        id: '1',
        email,
        name: `${firstName} ${lastName}`,
        role: 'user',
      };

      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error: unknown) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
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