import React, { useState } from 'react';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MButton from '../../components/MButton';
import staffAPI from '../../services/staffService';
import type { CreateStaffData } from '../../services/staffService';

interface StaffCreatePayload {
  full_name: string;
  phone: string;
  email: string;
  hire_date: string;
  role: 'staff';
  password: string;
}

const StaffAddForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<StaffCreatePayload>({
    full_name: '',
    phone: '',
    email: '',
    hire_date: '',
    role: 'staff',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!form.full_name || !form.phone || !form.email || !form.hire_date || !form.password) {
      setError('Please fill all required fields.');
      return;
    }

    setSaving(true);
    try {
      const payload: StaffCreatePayload = {
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        hire_date: form.hire_date,
        role: 'staff',
        password: form.password,
      };

      // staffService.create expects CreateStaffData shape; map local fields to API shape
      const createPayload = {
        name: payload.full_name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        hireDate: payload.hire_date,
      };
  await staffAPI.create(createPayload as unknown as CreateStaffData);
      navigate('/staff');
    } catch (err: unknown) {
      const e = err as unknown;
      const respData = (e as { response?: { data?: unknown } })?.response?.data as
        | { message?: string }
        | string
        | undefined;
      const message = typeof respData === 'string' ? respData : respData?.message;
      setError(message || (e as { message?: string })?.message || 'Failed to create staff member');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 720, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Add Staff Member
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

        <MButton type="submit" variant="contained" disabled={saving}>
          {saving ? 'Saving...' : 'Create Staff'}
        </MButton>
      </Box>
    </Paper>
  );
};

export default StaffAddForm;