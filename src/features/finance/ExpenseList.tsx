import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingDown as ExpenseIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { expenseService } from '../../services/api';
import { Expense } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const ExpenseList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await expenseService.getAll();
      const data = response.data || [];
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch expenses:', err);
      setError('Failed to load expenses. Please try again.');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;

    try {
      await expenseService.delete(expenseToDelete.expense_id.toString());
      setExpenses(expenses.filter((exp) => exp.expense_id !== expenseToDelete.expense_id));
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
    } catch (err: unknown) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };

  const handleDeleteClick = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    const csvHeaders = 'Date,Amount,Category,Description,Recorded By\n';
    const csvData = filteredExpenses
      .map((exp) => {
        const date = new Date(exp.expense_date).toLocaleDateString();
        const amount = exp.amount;
        const category = exp.category || '';
        const description = (exp.description || '').replace(/,/g, ';');
        const recordedBy = exp.recordedByStaff ? exp.recordedByStaff.full_name : 'Unknown';
        return `${date},${amount},${category},"${description}",${recordedBy}`;
      })
      .join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (categoryFilter !== 'all' && exp.category !== categoryFilter) {
      return false;
    }

    const expDate = new Date(exp.expense_date);
    if (startDate && expDate < new Date(startDate)) {
      return false;
    }
    if (endDate && expDate > new Date(endDate)) {
      return false;
    }

    return true;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string): 'error' | 'warning' | 'info' | 'default' => {
    switch (category) {
      case 'Salary':
        return 'error';
      case 'Rent':
        return 'warning';
      case 'Utilities':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Expenses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage clinic expenses
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <MOutlineButton startIcon={<ExportIcon />} onClick={handleExport}>
            Export CSV
          </MOutlineButton>
          <MButton startIcon={<AddIcon />} onClick={() => navigate('/finance/expenses/new')}>
            Record Expense
          </MButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3, bgcolor: '#fff3e0' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <ExpenseIcon sx={{ fontSize: 40, color: 'error.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Expenses
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {formatCurrency(totalExpenses)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredExpenses.length} transactions
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Rent">Rent</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Supplies">Supplies</MenuItem>
                <MenuItem value="Equipment">Equipment</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 180 }}
            />
            {(categoryFilter !== 'all' || startDate || endDate) && (
              <MOutlineButton
                onClick={() => {
                  setCategoryFilter('all');
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Clear Filters
              </MOutlineButton>
            )}
          </Box>
        </CardContent>
      </Card>

      {filteredExpenses.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={6}>
              <ExpenseIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No expenses found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start tracking expenses to monitor your clinic's financial health
              </Typography>
              <MButton startIcon={<AddIcon />} onClick={() => navigate('/finance/expenses/new')}>
                Record First Expense
              </MButton>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Recorded By</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.expense_id} hover>
                  <TableCell>{formatDate(expense.expense_date)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                      {formatCurrency(expense.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expense.category || 'Other'}
                      size="small"
                      color={getCategoryColor(expense.category || '')}
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" noWrap>
                      {expense.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{expense.recordedByStaff ? expense.recordedByStaff.full_name : 'Unknown'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/finance/expenses/${expense.expense_id}/edit`)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(expense)}
                      title="Delete"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this expense of{' '}
            <strong>{expenseToDelete && formatCurrency(expenseToDelete.amount)}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <MOutlineButton onClick={() => setDeleteDialogOpen(false)}>Cancel</MOutlineButton>
          <MButton onClick={handleDelete} color="error">
            Delete
          </MButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseList;
