import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';
import { doctorAPI } from '../../services/api';
import { Doctor } from '../../types';
import { useAuthContext } from '../../context/useAuthContext';
import { canManageDoctors, UserRole } from '../../utils/permissions';

const DoctorList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const normalizeDoctors = (res: unknown): Doctor[] => {
    if (Array.isArray(res)) return res as Doctor[];

    if (res && typeof res === 'object') {
      const r1 = res as Record<string, unknown>;
      if (Array.isArray(r1.data)) return r1.data as Doctor[];
      const inner = r1.data;
      if (inner && typeof inner === 'object') {
        const r2 = inner as Record<string, unknown>;
        if (Array.isArray(r2.data)) return r2.data as Doctor[];
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await doctorAPI.getAll();
        const list = normalizeDoctors(res);
        setDoctors(list);
      } catch (err) {
        console.error('Failed to fetch doctors', err);
        setDoctors([]);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Are you sure you want to delete this doctor?');
    if (!ok) return;
    try {
      setActionLoading(id);
      await doctorAPI.delete(id);
      setDoctors(prev => prev.filter(d => (d.doctor_id ?? d.staff_id) !== id));
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) {
    return (
      <Typography sx={{ mt: 4 }} align="center">
        You must be logged in to view this page.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 8, mb: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Doctors
          </Typography>

          {isError && <Alert severity="error">Failed to load doctors</Alert>}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                {canManageDoctors(user.role as UserRole | undefined) && <TableCell>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.length ? (
                doctors.map((doctor) => {
                  const id = doctor.doctor_id ?? doctor.staff_id;
                  return (
                    <TableRow key={id}>
                      <TableCell>{doctor.full_name ?? doctor.full_name}</TableCell>
                      <TableCell>{doctor.gender ?? '-'}</TableCell>
                      <TableCell>{doctor.phone ?? '-'}</TableCell>
                      <TableCell>{doctor.email ?? '-'}</TableCell>
                      {canManageDoctors(user.role as UserRole | undefined) && (
                        <TableCell>
                          <MOutlineButton
                            component={Link}
                            to={`/doctors/${id}/edit`}
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </MOutlineButton>
                          <MOutlineButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(Number(id))}
                            disabled={actionLoading === Number(id)}
                          >
                            {actionLoading === Number(id) ? 'Deleting...' : 'Delete'}
                          </MOutlineButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={canManageDoctors(user.role as UserRole | undefined) ? 5 : 4} align="center">
                    No doctors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
  {canManageDoctors(user.role as UserRole | undefined) && (
        <FloatingAddButton
          onClick={() => navigate('/doctors/new')}
          ariaLabel="Add new doctor"
        />
      )}
    </Container>
  );
};

export default DoctorList;