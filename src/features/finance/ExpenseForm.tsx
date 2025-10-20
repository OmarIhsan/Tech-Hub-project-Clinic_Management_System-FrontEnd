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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { expenseService } from '../../services/api';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';
import { useAuthContext } from '../../context/useAuthContext';

const EXPENSE_CATEGORIES = [
  'Salary',
  'Rent',
  'Utilities',
  'Supplies',
  'Equipment',
  'Maintenance',
  'Other',
];

const ExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Other',
    description: '',
    reason: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchExpense(Number(id));
    }
  }, [id, isEditMode]);

  const fetchExpense = async (expenseId: number) => {
    try {
      setLoading(true);
      const response = await expenseService.getById(expenseId.toString());
      const expense = response.data;
      
      setFormData({
        expense_date: expense.expense_date.split('T')[0],
        amount: expense.amount.toString(),
        category: expense.category || 'Other',
        description: expense.description || expense.reason || '',
        reason: expense.reason || expense.description || '',
      });
    } catch (err: unknown) {
      console.error('Failed to fetch expense:', err);
      setError('Failed to load expense details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.expense_date) {
      setError('Expense date is required');
      return false;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }

    if (!formData.category) {
      setError('Category is required');
      return false;
    }

    const expenseDate = new Date(formData.expense_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expenseDate > today) {
      setError('Expense date cannot be in the future');
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

      const expenseData = {
        expense_date: formData.expense_date,
        amount: Number(formData.amount),
        category: formData.category,
        reason: formData.reason || formData.description || undefined,
        staff_id: user?.staff_id,
      };

      if (isEditMode && id) {
        await expenseService.update(id, expenseData);
      } else {
        await expenseService.create(expenseData);
      }

      navigate('/finance/expenses');
    } catch (err: unknown) {
      console.error('Failed to save expense:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = err as { response?: { data?: unknown; status?: number } };
        setError(JSON.stringify(apiError.response?.data) || `Failed to save expense (status ${apiError.response?.status})`);
      } else {
        setError('Failed to save expense. Please try again.');
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
          <MOutlineButton startIcon={<BackIcon />} onClick={() => navigate('/finance/expenses')}>
            Back
          </MOutlineButton>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {isEditMode ? 'Edit Expense' : 'Record New Expense'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isEditMode ? 'Update expense details' : 'Enter expense information to track spending'}
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
              label="Expense Date"
              type="date"
              value={formData.expense_date}
              onChange={(e) => handleChange('expense_date', e.target.value)}
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

            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {EXPENSE_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter expense details (optional)"
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <MOutlineButton
                onClick={() => navigate('/finance/expenses')}
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
                  'Update Expense'
                ) : (
                  'Record Expense'
                )}
              </MButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ExpenseForm;
