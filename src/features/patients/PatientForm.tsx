import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import MButton from '../../components/MButton';
import { patientAPI } from '../../services/patientService';

interface PatientPayload {
  full_name: string;
  gender?: string;
  date_of_birth?: string; // YYYY-MM-DD
  phone?: string;
  email?: string;
  address?: string;
}

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit support if needed
  const [form, setForm] = useState<PatientPayload>({
    full_name: '',
    gender: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const loadedPatient = await patientAPI.getById(Number(id));
        if (loadedPatient) {
          setForm({ 
            full_name: loadedPatient.full_name,
            gender: loadedPatient.gender,
            phone: loadedPatient.phone,
            email: loadedPatient.email,
            date_of_birth: loadedPatient.date_of_birth,
            address: loadedPatient.address,
          });
        }
      } catch (err) {
        console.error('Failed to load patient:', err);
        setError('Failed to load patient');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!form.full_name) {
      setError('Full name is required.');
      return;
    }

    setSaving(true);
    try {
      if (id) {
        await patientAPI.update(Number(id), form);
      } else {
        await patientAPI.create(form);
      }
      navigate('/patients');
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message || (err as any)?.message || 'Failed to save patient';
      setError(String(msg));
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
    <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Patient' : 'Add Patient'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
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
          select={false}
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          placeholder="Male / Female / Other"
          fullWidth
        />
        <TextField
          label="Date of birth"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <MButton type="submit" variant="contained" disabled={saving}>
          {saving ? 'Saving...' : id ? 'Save Patient' : 'Create Patient'}
        </MButton>
      </Box>
    </Paper>
  );
};

export default PatientForm;
