import React, { useState, useEffect } from 'react';
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
import { staffService } from '../../services/staffService';
import { Staff, StaffRole } from '../../types';

const StaffList: React.FC = () => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const result = await staffService.getAll();
        let staffArray: Staff[] = [];
        // Type guard for backend response - { data: Staff[] }
        if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          Array.isArray(result.data)
        ) {
          // Filter to show only staff members with role === 'staff'
          staffArray = (result.data as Staff[]).filter(
            (staff) => staff.role === StaffRole.STAFF
          );
        }
        setStaffMembers(staffArray);
      } catch {
        setIsError(true);
        setStaffMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      setActionLoading(id);
      await staffService.delete(String(id));
      setStaffMembers((prev) => prev.filter((s) => s.staff_id !== id));
    } catch (err) {
      console.error('Failed to delete staff member:', err);
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
            Staff Members
          </Typography>

          {isError && <Alert severity="error">Failed to load staff members</Alert>}

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                staffMembers.map((staff) => (
                  <TableRow key={staff.staff_id}>
                    <TableCell>{staff.full_name}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <MOutlineButton
                        component={Link}
                        to={`/staff/${staff.staff_id}/edit`}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </MOutlineButton>
                      <MOutlineButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(staff.staff_id)}
                        disabled={actionLoading === staff.staff_id}
                      >
                        {actionLoading === staff.staff_id ? 'Deleting...' : 'Delete'}
                      </MOutlineButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      <FloatingAddButton
        onClick={() => navigate('/staff/add')}
        ariaLabel="Add new staff member"
      />
    </Container>
  );
};

export default StaffList;
