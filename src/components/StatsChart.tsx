import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Patient {
  patient_id: number;
  full_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface StatsChartProps {
  title: string;
  type: 'bar' | 'pie';
  data: Patient[]; // <-- Accepts the API response array
  colors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Helper to transform patient data for chart
const transformPatientData = (patients: Patient[]) => {
  // Example: show patient count by gender
  const genderCount: { [key: string]: number } = {};
  patients.forEach(p => {
    genderCount[p.gender] = (genderCount[p.gender] || 0) + 1;
  });
  return Object.entries(genderCount).map(([name, value]) => ({ name, value }));
};

export const StatsChart: React.FC<StatsChartProps> = ({ 
  title, 
  type, 
  data,
  colors = COLORS 
}) => {
  // Transform the API response for charting
  const chartData = transformPatientData(data);

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => `${props.name}: ${(props.percent ? Number(props.percent) * 100 : 0).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StatsChart;
