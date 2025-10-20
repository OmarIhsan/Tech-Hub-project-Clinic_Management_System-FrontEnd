import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import MButton from '../../components/MButton';

const Login: React.FC = () => {
  const navigate = useNavigate();
  // Prefill owner credentials for faster testing in dev
  const [email, setEmail] = useState('owner@cms.com');
  const [password, setPassword] = useState('StrongPassword123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent native form submit (page reload) immediately
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authAPI.login({ email, password });
      navigate('/');
    } catch (err: unknown) {
      const axiosErr = err as unknown;
      // Narrow possible axios error shape safely
  const status = (axiosErr as { response?: { status?: number; data?: unknown } })?.response?.status;
      const message = (axiosErr as { message?: string })?.message;
      if (status === 401) {
  const respData = (axiosErr as { response?: { data?: unknown } })?.response?.data as { message?: string } | undefined;
        setError(respData?.message || 'Invalid credentials');
      } else {
        setError(message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              margin="normal"
              required
            />

            <MButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </MButton>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;