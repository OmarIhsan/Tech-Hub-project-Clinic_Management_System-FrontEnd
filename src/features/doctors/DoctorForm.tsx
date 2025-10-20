import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MButton from '../../components/MButton';
import { doctorAPI } from '../../services/api';
import { useAuthContext } from '../../context/useAuthContext';

interface DoctorCreatePayload {
  full_name: string;
  phone: string;
  email: string;
  hire_date: string; // YYYY-MM-DD
  role: string;
  password: string;
  gender?: string; // added
}

const DoctorForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuthContext();

  const [form, setForm] = useState<DoctorCreatePayload>({
    full_name: '',
    phone: '',
    email: '',
    hire_date: '',
    role: 'doctor',
    password: '',
    gender: 'Male', // default or '' to let user choose
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const loadedDoctor = await doctorAPI.getById(Number(id));
        if (loadedDoctor) {
          setForm({ 
            full_name: loadedDoctor.full_name, 
            phone: loadedDoctor.phone,
            email: loadedDoctor.email,
            hire_date: loadedDoctor.hire_date,
            role: 'doctor',
            password: '',
            gender: 'Male', // default or '' to let user choose
          });
        }
      } catch (err) {
        console.error('Failed to load doctor:', err);
        setError('Failed to load doctor');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    // basic validation
    if (!form.full_name || !form.phone || !form.email || !form.hire_date || !form.password) {
      setError('Please fill all required fields.');
      return;
    }

    setSaving(true);
    try {
      // send payload exactly as requested
      const payload: DoctorCreatePayload = {
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        hire_date: form.hire_date,
        role: 'doctor',
        password: form.password,
        gender: form.gender, // include gender
      };

      if (id) {
        await doctorAPI.update(Number(id), payload);
      } else {
        await doctorAPI.create(payload);
      }
      navigate('/doctors');
    } catch (err: unknown) {
      // show backend message when available
      type ErrorWithResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };
      const errorObj = err as ErrorWithResponse;
      const message =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        'Failed to create doctor';
      setError(String(message));
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
    return (
      <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Doctor' : 'Add Doctor'}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Full name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          type="email"
          fullWidth
        />
        <TextField
          label="Hire date"
          name="hire_date"
          value={form.hire_date}
          onChange={handleChange}
          required
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          type="password"
          fullWidth
        />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {/* or use MUI <TextField select> — place this inside the form markup */}
        <MButton type="submit" variant="contained" disabled={saving}>
          {saving ? 'Saving...' : id ? 'Update Doctor' : 'Create Doctor'}
        </MButton>
      </Box>
    </Paper>
  );
};

export default DoctorForm;
