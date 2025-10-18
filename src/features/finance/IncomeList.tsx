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
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as IncomeIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { otherIncomeService } from '../../services/api';
import { OtherIncome } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

const IncomeList = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState<OtherIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<OtherIncome | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await otherIncomeService.getAll();
      const data = response.data || [];
      setIncome(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Failed to fetch income:', err);
      setError('Failed to load income records. Please try again.');
      setIncome([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!incomeToDelete) return;

    try {
      await otherIncomeService.delete(incomeToDelete.income_id.toString());
      setIncome(income.filter((inc) => inc.income_id !== incomeToDelete.income_id));
      setDeleteDialogOpen(false);
      setIncomeToDelete(null);
    } catch (err: unknown) {
      console.error('Failed to delete income:', err);
      setError('Failed to delete income record. Please try again.');
    }
  };

  const handleDeleteClick = (incomeRecord: OtherIncome) => {
    setIncomeToDelete(incomeRecord);
    setDeleteDialogOpen(true);
  };

  const handleExport = () => {
    const csvHeaders = 'Date,Amount,Source,Description,Recorded By\n';
    const csvData = filteredIncome
      .map((inc) => {
        const date = new Date(inc.income_date).toLocaleDateString();
        const amount = inc.amount;
        const source = inc.source || '';
        const description = (inc.description || '').replace(/,/g, ';');
        const recordedBy = inc.recordedByStaff ? inc.recordedByStaff.full_name : 'Unknown';
        return `${date},${amount},${source},"${description}",${recordedBy}`;
      })
      .join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredIncome = income.filter((inc) => {
    // Date range filter
    const incDate = new Date(inc.income_date);
    if (startDate && incDate < new Date(startDate)) {
      return false;
    }
    if (endDate && incDate > new Date(endDate)) {
      return false;
    }

    return true;
  });

  const totalIncome = filteredIncome.reduce((sum, inc) => sum + Number(inc.amount || 0), 0);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Other Income
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage additional income sources
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <MOutlineButton startIcon={<ExportIcon />} onClick={handleExport}>
            Export CSV
          </MOutlineButton>
          <MButton startIcon={<AddIcon />} onClick={() => navigate('/finance/income/new')}>
            Record Income
          </MButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Card */}
      <Card sx={{ mb: 3, bgcolor: '#e8f5e9' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <IncomeIcon sx={{ fontSize: 40, color: 'success.main' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Income
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {formatCurrency(totalIncome)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filteredIncome.length} transactions
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filters
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
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
            {(startDate || endDate) && (
              <MOutlineButton
                onClick={() => {
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

      {/* Income Table */}
      {filteredIncome.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={6}>
              <IncomeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No income records found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start tracking additional income to get a complete financial picture
              </Typography>
              <MButton startIcon={<AddIcon />} onClick={() => navigate('/finance/income/new')}>
                Record First Income
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
                  <strong>Source</strong>
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
              {filteredIncome.map((incomeRecord) => (
                <TableRow key={incomeRecord.income_id} hover>
                  <TableCell>{formatDate(incomeRecord.income_date)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      {formatCurrency(incomeRecord.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>{incomeRecord.source || '-'}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" noWrap>
                      {incomeRecord.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{incomeRecord.recordedByStaff ? incomeRecord.recordedByStaff.full_name : 'Unknown'}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/finance/income/${incomeRecord.income_id}/edit`)}
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(incomeRecord)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this income record of{' '}
            <strong>{incomeToDelete && formatCurrency(incomeToDelete.amount)}</strong>?
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

export default IncomeList;
