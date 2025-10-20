import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { expenseService, otherIncomeService, procedureService } from '../../services/api';
import { Expense, OtherIncome, Procedure } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<OtherIncome[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError('');

        const [expensesRes, incomeRes, proceduresRes] = await Promise.all([
          expenseService.getAll(),
          otherIncomeService.getAll(),
          procedureService.getAll(),
        ]);

        const expensesData = expensesRes.data || [];
        const incomeData = incomeRes.data || [];
        const proceduresData = proceduresRes.data || [];

        const now = new Date();
        const startDate = getStartDate(now, dateRange);

        const filteredExpenses = expensesData.filter((exp: Expense) => {
          const expDate = new Date(exp.expense_date);
          return expDate >= startDate && expDate <= now;
        });

        const filteredIncome = incomeData.filter((inc: OtherIncome) => {
          const incDate = new Date(inc.income_date);
          return incDate >= startDate && incDate <= now;
        });

        const filteredProcedures = proceduresData.filter((proc: Procedure) => {
          const procDate = new Date(proc.procedure_date);
          return procDate >= startDate && procDate <= now;
        });

        setExpenses(filteredExpenses);
        setIncome(filteredIncome);
        setProcedures(filteredProcedures);
      } catch (err: unknown) {
        console.error('Failed to fetch financial data:', err);
        setError('Failed to load financial data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [dateRange]);

  const getStartDate = (now: Date, range: 'month' | 'quarter' | 'year'): Date => {
    const date = new Date(now);
    switch (range) {
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarter':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  };

  const calculateTotalExpenses = (): number => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  };

  const calculateTotalIncome = (): number => {
    return income.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);
  };

  const calculateProcedureRevenue = (): number => {
    return procedures.reduce((sum, proc) => sum + Number(proc.cost || 0), 0);
  };

  const calculateNetIncome = (): number => {
    const totalIncome = calculateTotalIncome() + calculateProcedureRevenue();
    const totalExpenses = calculateTotalExpenses();
    return totalIncome - totalExpenses;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getExpensesByCategory = () => {
    const categories: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const category = exp.category || 'Other';
      categories[category] = (categories[category] || 0) + Number(exp.amount || 0);
    });
    return categories;
  };

  const netIncome = calculateNetIncome();
  const isPositive = netIncome >= 0;

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
            Financial Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage expenses, income, and track financial performance
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={dateRange}
              label="Period"
              onChange={(e) => setDateRange(e.target.value as 'month' | 'quarter' | 'year')}
            >
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ bgcolor: '#fff3e0' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {formatCurrency(calculateTotalExpenses())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {expenses.length} transactions
                </Typography>
              </Box>
              <TrendingDownIcon sx={{ fontSize: 48, color: 'error.main', opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#e8f5e9' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Other Income
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {formatCurrency(calculateTotalIncome())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {income.length} transactions
                </Typography>
              </Box>
              <MoneyIcon sx={{ fontSize: 48, color: 'success.main', opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: '#e3f2fd' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Procedure Revenue
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {formatCurrency(calculateProcedureRevenue())}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {procedures.length} procedures
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ bgcolor: isPositive ? '#e8f5e9' : '#ffebee' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Net Income
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={isPositive ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(netIncome)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isPositive ? 'Profit' : 'Loss'}
                </Typography>
              </Box>
              <BalanceIcon
                sx={{
                  fontSize: 48,
                  color: isPositive ? 'success.main' : 'error.main',
                  opacity: 0.3,
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Expenses by Category
          </Typography>
          {expenses.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body2" color="text.secondary">
                No expenses recorded for this period
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              {Object.entries(getExpensesByCategory()).map(([category, amount]) => (
                <Box
                  key={category}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {category}
                  </Typography>
                  <Typography variant="body2" color="error.main" fontWeight="bold">
                    {formatCurrency(amount)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
          <MButton onClick={() => navigate('/finance/expenses/new')}>Record Expense</MButton>
          <MButton onClick={() => navigate('/finance/income/new')}>Record Income</MButton>
          <MOutlineButton onClick={() => navigate('/finance/expenses')}>
            View All Expenses
          </MOutlineButton>
          <MOutlineButton onClick={() => navigate('/finance/income')}>
            View All Income
          </MOutlineButton>
          <MOutlineButton onClick={() => navigate('/procedures')}>
            View Procedures
          </MOutlineButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default FinanceDashboard;
