import React, { useState } from 'react';
import { Box, TextField, Alert, CircularProgress } from '@mui/material';
import MButton from '../../components/MButton';
import { authAPI } from '../../services/api';

interface StaffMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StaffMemberForm: React.FC<StaffMemberFormProps> = ({ onSuccess, onCancel }) => {
  const [staffData, setStaffData] = useState({
    email: '',
    full_name: '',
    password: '',
    phone: '',
    role: 'staff' as 'owner' | 'doctor' | 'staff',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaffData({ ...staffData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (staffData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await authAPI.register({
        email: staffData.email,
        password: staffData.password,
        full_name: staffData.full_name,
        phone: staffData.phone,
        role: staffData.role,
      });

      setStaffData({
        email: '',
        full_name: '',
        password: '',
        phone: '',
        role: 'staff',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('Failed to create staff member:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to create staff member');
      } else {
        setError('Failed to create staff member');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          name="full_name"
          value={staffData.full_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ minLength: 2 }}
          error={staffData.full_name.length > 0 && staffData.full_name.length < 2}
          helperText={
            staffData.full_name.length > 0 && staffData.full_name.length < 2
              ? "Name must be at least 2 characters"
              : undefined
          }
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={staffData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={staffData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{ minLength: 6 }}
          error={staffData.password.length > 0 && staffData.password.length < 6}
          helperText={
            staffData.password.length > 0 && staffData.password.length < 6
              ? "Password must be at least 6 characters"
              : undefined
          }
        />
        <TextField
          label="Phone"
          name="phone"
          value={staffData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Role"
          name="role"
          value={staffData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          select
          SelectProps={{ native: true }}
        >
          <option value="staff">Staff</option>
          <option value="owner">Owner</option>
        </TextField>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          {onCancel && (
            <MButton
              variant="outlined"
              fullWidth
              onClick={onCancel}
              disabled={submitting}
            >
              Back
            </MButton>
          )}
          <MButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={submitting}
          >
            Create Staff Member
          </MButton>
        </Box>
      </form>
    </Box>
  );
};

export default StaffMemberForm;
