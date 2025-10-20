import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { otherIncomeService } from '../../services/api';
import { patientAPI } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';
import { useAuthContext } from '../../context/useAuthContext';

const IncomeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<{ patient_id: number; full_name: string }[]>([]);
  const [formData, setFormData] = useState({
    income_date: new Date().toISOString().split('T')[0],
    amount: '',
    source: '',
    patient_id: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchIncome(Number(id));
    }
    (async () => {
      try {
        const p = await patientAPI.getAll({ offset: 0, limit: 200 });
        setPatients(p.map((pt) => ({ patient_id: pt.patient_id, full_name: pt.full_name })));
      } catch (err) {
        console.error('Failed to load patients for income form:', err);
      }
    })();
  }, [id, isEditMode]);

  const fetchIncome = async (incomeId: number) => {
    try {
      setLoading(true);
      const response = await otherIncomeService.getById(incomeId.toString());
      const income = response.data;
      
      setFormData({
        income_date: income.income_date.split('T')[0],
        amount: income.amount.toString(),
        source: income.source || '',
  patient_id: (income as unknown as Record<string, unknown>)?.patient_id ? String((income as unknown as Record<string, unknown>).patient_id) : '',
      });
    } catch (err: unknown) {
      console.error('Failed to fetch income:', err);
      setError('Failed to load income details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.income_date) {
      setError('Income date is required');
      return false;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (!formData.source || formData.source.trim().length < 2) {
      setError('Source must be at least 2 characters');
      return false;
    }

    const incomeDate = new Date(formData.income_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (incomeDate > today) {
      setError('Income date cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.staff_id) {
      setError('User session not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const incomeData = {
        income_date: formData.income_date,
        amount: Number(formData.amount),
        source: formData.source,
        staff_id: user?.staff_id,
        patient_id: formData.patient_id ? Number(formData.patient_id) : undefined,
      };

      if (isEditMode && id) {
        await otherIncomeService.update(id, incomeData);
      } else {
        await otherIncomeService.create(incomeData);
      }

      navigate('/finance/income');
    } catch (err: unknown) {
      console.error('Failed to save income:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { data?: unknown; status?: number } };
        setError(JSON.stringify(apiError.response?.data) || `Failed to save income (status ${apiError.response?.status})`);
      } else {
        setError('Failed to save income. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <MOutlineButton startIcon={<BackIcon />} onClick={() => navigate('/finance/income')}>
            Back
          </MOutlineButton>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {isEditMode ? 'Edit Income' : 'Record New Income'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update income details' : 'Enter income information to track revenue'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Income Date"
              type="date"
              value={formData.income_date}
              onChange={(e) => handleChange('income_date', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              inputProps={{
                max: new Date().toISOString().split('T')[0],
              }}
            />

            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
              inputProps={{
                min: 0.01,
                step: 0.01,
              }}
              sx={{ mb: 3 }}
              helperText="Enter amount in USD"
            />

            <TextField
              fullWidth
              label="Source"
              value={formData.source}
              onChange={(e) => handleChange('source', e.target.value)}
              required
              placeholder="e.g., Insurance Reimbursement, Consultation Fee, Lab Service"
              sx={{ mb: 3 }}
              helperText="Enter the source of income"
            />

            <Autocomplete
              options={patients}
              getOptionLabel={(option) => option.full_name}
              value={
                formData.patient_id
                  ? patients.find((p) => String(p.patient_id) === String(formData.patient_id)) || null
                  : null
              }
              onChange={(_, newValue) => handleChange('patient_id', newValue ? String(newValue.patient_id) : '')}
              renderInput={(params) => (
                <TextField {...params} label="Patient (optional)" placeholder="Select patient" sx={{ mb: 3 }} />
              )}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <MOutlineButton
                onClick={() => navigate('/finance/income')}
                disabled={loading}
              >
                Cancel
              </MOutlineButton>
              <MButton type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : isEditMode ? (
                  'Update Income'
                ) : (
                  'Record Income'
                )}
              </MButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default IncomeForm;
