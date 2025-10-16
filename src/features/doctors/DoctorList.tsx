import { useState } from 'react';
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
} from '@mui/material';
import MOutlineButton from '../../components/MOutlineButton';
import FloatingAddButton from '../../components/FloatingAddButton';
import { doctorAPI } from '../../services/api';
import { CircularProgress, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const DoctorList = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: doctors = [], isLoading, isError } = useQuery({
    queryKey: ['doctors'],
    queryFn: () => doctorAPI.getAll(),
  });

  const deleteMutation = useMutation<string, unknown, string>({
    mutationFn: async (id: string) => {
      await doctorAPI.delete(id);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doctors'] }),
  });

  const handleDelete = async (id) => {
    const ok = window.confirm('Are you sure you want to delete this doctor?');
    if (!ok) return;
    try {
      setActionLoading(id);
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to delete doctor:', err);
    } finally {
      setActionLoading(null);
    }
  };

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
                <TableCell>Specialty</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialty}</TableCell>
                  <TableCell>{doctor.contact}</TableCell>
                  <TableCell>
                    <MOutlineButton
                      component={Link}
                      to={`/doctors/${doctor.id}/edit`}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </MOutlineButton>
                    <MOutlineButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(doctor.id)}
                      disabled={actionLoading === doctor.id}
                    >
                      {actionLoading === doctor.id ? 'Deleting...' : 'Delete'}
                    </MOutlineButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      
      <FloatingAddButton
        onClick={() => navigate('/doctors/new')}
        ariaLabel="Add new doctor"
      />
    </Container>
  );
};

export default DoctorList;