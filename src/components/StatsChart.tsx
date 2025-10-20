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

interface ChartDatum {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface StatsChartProps {
  title: string;
  type: 'bar' | 'pie';
  data: ChartDatum[] | unknown[];
  colors?: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const StatsChart: React.FC<StatsChartProps> = ({ 
  title, 
  type, 
  data,
  colors = COLORS 
}) => {
  const isChartDatum = (v: unknown): v is ChartDatum => {
    if (!v || typeof v !== 'object') return false;
    const obj = v as Record<string, unknown>;
    return typeof obj.name === 'string' && typeof obj.value === 'number';
  };

  const chartData: ChartDatum[] = Array.isArray(data) && data.length > 0 && isChartDatum(data[0])
    ? (data as ChartDatum[])
    : [];

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
