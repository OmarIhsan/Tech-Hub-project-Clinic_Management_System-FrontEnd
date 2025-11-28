import { useContext } from 'react';
import { LocalAuthContext as AuthContext, AuthContextType } from './AuthContext';

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    if (import.meta.env.DEV) {
      console.warn('useAuthContext called outside of an AuthProvider - returning development fallback.');
      return {
        user: null,
        token: null,
        login: () => {},
        loginWithCredentials: async () => ({ success: false, error: 'Auth provider unavailable (dev fallback)' }),
        register: async () => ({ success: false, error: 'Auth provider unavailable (dev fallback)' }),
        logout: () => {},
        isAuthenticated: () => false,
        loading: false,
        isAdmin: () => false,
        getCurrentUser: () => null,
        refreshAfterLogin: () => {},
      } as AuthContextType;
    }

    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
}