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
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { otherIncomeService } from '../../services/api';
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
  const [formData, setFormData] = useState({
    income_date: new Date().toISOString().split('T')[0],
    amount: '',
    source: '',
    description: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchIncome(Number(id));
    }
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
        description: income.description || '',
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

    // Validate date is not in future
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
        date: formData.income_date,
        amount: Number(formData.amount),
        source: formData.source,
        notes: formData.description || undefined,
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
        const apiError = err as { response?: { data?: { message?: string } } };
        setError(apiError.response?.data?.message || 'Failed to save income');
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
      {/* Header */}
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

      {/* Form */}
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Income Date */}
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

            {/* Amount */}
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

            {/* Source */}
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

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter additional details (optional)"
              sx={{ mb: 3 }}
            />

            {/* Action Buttons */}
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
