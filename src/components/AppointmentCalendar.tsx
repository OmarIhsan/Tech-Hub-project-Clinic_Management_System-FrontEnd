import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { appointmentService } from '../services/api';
import { Appointment } from '../types';
import MButton from './MButton';

interface AppointmentCalendarProps {
  onDateSelect?: (date: Date) => void;
  doctorId?: number;
  patientId?: number;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onDateSelect,
  doctorId,
  patientId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [, setLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [doctorId, patientId]);

  useEffect(() => {
    if (selectedDate) {
      filterAppointmentsByDate(selectedDate);
    }
  }, [selectedDate, appointments]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll();
      let filtered = response.data || [];

      if (doctorId) {
        filtered = filtered.filter((apt: Appointment) => apt.doctor_id === doctorId);
      }

      if (patientId) {
        filtered = filtered.filter((apt: Appointment) => apt.patient_id === patientId);
      }

      setAppointments(filtered);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointmentsByDate = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const filtered = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_time);
      return aptDate >= startOfDay && aptDate <= endOfDay;
    });

    setDayAppointments(filtered);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'no_show':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appointment Calendar
        </Typography>

        <Box sx={{ mb: 2 }}>
          <input
            type="date"
            value={selectedDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </Box>

        {selectedDate && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Appointments on {selectedDate.toLocaleDateString()}
              </Typography>
              {dayAppointments.length > 0 && (
                <MButton size="small" onClick={() => setDetailsOpen(true)}>
                  View Details
                </MButton>
              )}
            </Box>

            {dayAppointments.length === 0 ? (
              <Alert severity="info">No appointments scheduled for this date</Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {dayAppointments.slice(0, 3).map((apt) => (
                  <Paper key={apt.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {new Date(apt.appointment_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {apt.patient.full_name} - Dr. {apt.doctor.full_name}
                        </Typography>
                      </Box>
                      <Chip label={apt.status} size="small" color={getStatusColor(apt.status)} />
                    </Box>
                  </Paper>
                ))}
                {dayAppointments.length > 3 && (
                  <Typography variant="caption" color="textSecondary" textAlign="center">
                    +{dayAppointments.length - 3} more appointments
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Appointments on {selectedDate?.toLocaleDateString()}
            </Typography>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {dayAppointments.map((apt) => (
              <Paper key={apt.id} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {new Date(apt.appointment_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Patient:</strong> {apt.patient.full_name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Doctor:</strong> Dr. {apt.doctor.full_name}
                    </Typography>
                    {apt.patient.phone && (
                      <Typography variant="body2">
                        <strong>Phone:</strong> {apt.patient.phone}
                      </Typography>
                    )}
                  </Box>
                  <Chip label={apt.status} color={getStatusColor(apt.status)} />
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <MButton onClick={() => setDetailsOpen(false)}>Close</MButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentCalendar;
