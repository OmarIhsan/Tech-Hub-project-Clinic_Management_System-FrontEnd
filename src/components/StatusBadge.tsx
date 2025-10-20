import React from 'react';
import { Chip } from '@mui/material';

type StatusBadgeProps = {
  status: string;
  size?: 'small' | 'medium';
};

const STATUS_COLOR_MAP: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'error',
  draft: 'default',
  active: 'info',
  onhold: 'warning',
  'on-hold': 'warning',
  urgent: 'error'
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const key = (status || '').toString().toLowerCase();
  const color = STATUS_COLOR_MAP[key] || 'default';
  const label = typeof status === 'string' ? status.replace(/-/g, ' ').toUpperCase() : String(status);

  return <Chip label={label} size={size} color={color as 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'} />;
};

export default StatusBadge;
