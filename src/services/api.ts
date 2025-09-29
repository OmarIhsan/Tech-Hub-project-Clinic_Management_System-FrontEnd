import api from '../config/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  register: (userData: RegisterData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};