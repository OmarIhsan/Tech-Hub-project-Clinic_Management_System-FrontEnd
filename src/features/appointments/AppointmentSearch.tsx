import React, { useState } from 'react';
import { Box, Container, Paper, TextField, Button, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, Typography, Alert } from '@mui/material';
import appointmentService from '../../services/appointmentService';
import { Appointment } from '../../types';

const AppointmentSearch: React.FC = () => {
  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Appointment[]>([]);
  const [count, setCount] = useState<number | undefined>(undefined);

  const validateNumber = (v: string) => v === '' || /^\d+$/.test(v);

  const buildParams = () => {
    const p: Record<string, string | number> = {};
    if (patientId !== '') p.patient_id = Number(patientId);
    if (doctorId !== '') p.doctor_id = Number(doctorId);
    if (typeof offset === 'number' && offset > 0) p.offset = offset;
    if (typeof limit === 'number' && limit > 0) p.limit = limit;
    return p;
  };

  const handleSearch = async () => {
    setError(null);
    if (!validateNumber(patientId) || !validateNumber(doctorId)) {
      setError('Patient ID and Doctor ID must be integers (or left blank).');
      return;
    }
    const params = buildParams();
    if (Object.keys(params).length === 0) {
      setError('Please provide at least one search parameter (patient_id or doctor_id).');
      return;
    }

    try {
      setLoading(true);
      const resp = await appointmentService.getAll(params as unknown as { offset?: number; limit?: number });
      setResults(resp.data || []);
      setCount((resp as unknown as { count?: number }).count ?? undefined);
      if (!resp.data || (Array.isArray(resp.data) && resp.data.length === 0)) {
        setError('No appointments found for the provided criteria.');
      }
    } catch (err: unknown) {
      console.error('Search error:', err);
      const axiosErr = err as { response?: { data?: { message?: unknown } }; message?: unknown };
      const msg = (axiosErr.response?.data && typeof axiosErr.response.data === 'object' && 'message' in axiosErr.response.data)
        ? String((axiosErr.response.data as { message?: unknown }).message)
        : (axiosErr.message ? String(axiosErr.message) : 'Failed to search appointments');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Search Appointments</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField label="Patient ID" value={patientId} onChange={(e) => setPatientId(e.target.value)} inputProps={{ inputMode: 'numeric' }} />
            <TextField label="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} inputProps={{ inputMode: 'numeric' }} />
            <TextField label="Offset" type="number" value={offset} onChange={(e) => setOffset(Number(e.target.value))} sx={{ width: 120 }} />
            <TextField label="Limit" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} sx={{ width: 120 }} />
            <Button variant="contained" onClick={handleSearch} disabled={loading}>Search</Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <>
              {results.length > 0 ? (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Showing {results.length}{count ? ` of ${count}` : ''}</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Appointment ID</TableCell>
                        <TableCell>Appointment Time</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{r.id}</TableCell>
                          <TableCell>{new Date(r.appointment_time).toLocaleString()}</TableCell>
                          <TableCell>{r.patient?.full_name ?? r.patient_id}</TableCell>
                          <TableCell>{r.doctor?.full_name ?? r.doctor_id}</TableCell>
                          <TableCell>{r.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">No results to show.</Typography>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default AppointmentSearch;
