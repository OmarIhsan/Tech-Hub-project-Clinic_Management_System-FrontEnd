import React, { useEffect, useState } from 'react';
import { Box, Alert } from '@mui/material';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PatientChart: React.FC = () => {
  const [data, setData] = useState<Array<{ date: string; count: number }>>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await appointmentService.getAll();
        const appts = res?.data || [];
        const now = new Date();
        const days: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          days[key] = 0;
        }
        appts.forEach((a: Appointment) => {
          const aDate = new Date(a.appointment_time || '');
          const key = aDate.toISOString().slice(0, 10);
          if (days[key] !== undefined) {
            days[key]++;
          }
        });
        const chartData = Object.keys(days).map(d => ({ date: d, count: days[d] }));
        if (mounted) setData(chartData);
      } catch (err) {
        console.error('Failed to load appointments for chart', err);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="info">No appointment data available for the next 7 days.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => (d as string).slice(5)} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#1976d2" activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PatientChart;
