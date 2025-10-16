import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { appointmentService } from '../../services/appointmentService';

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
          d.setDate(now.getDate() + i);
          const key = d.toISOString().slice(0, 10);
          days[key] = 0;
        }
        appts.forEach((a: any) => {
          try {
            const dt = new Date(a.date).toISOString().slice(0, 10);
            if (days[dt] !== undefined) days[dt]++;
          } catch (e) {
            // ignore parse errors
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

  // recharts is optional in this repo. Instead of importing it and breaking the dev server when
  // the package is not installed, show an informational placeholder with instructions.
  return (
    <Box sx={{ py: 2 }}>
      <Alert severity="info">Charts are optional. To enable charts, install <Typography component="span" sx={{ fontFamily: 'monospace' }}>recharts</Typography> and restart the dev server: <br /> <Typography component="span" sx={{ fontFamily: 'monospace' }}>npm install recharts</Typography></Alert>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="textSecondary">Sample data for next 7 days:</Typography>
        {data.map(d => (
          <Typography key={d.date} variant="body2">{d.date}: {d.count}</Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PatientChart;
