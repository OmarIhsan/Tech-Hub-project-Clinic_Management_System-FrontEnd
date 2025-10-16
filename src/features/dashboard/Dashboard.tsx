import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import {
  EventNote as AppointmentIcon,
  People as PatientsIcon,
  LocalHospital as DoctorsIcon,
  Assignment as TreatmentIcon,
  Description as DocumentsIcon,
  MedicalServices as MedicalRecordsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';


const Dashboard = () => {
  const navigate = useNavigate();

  const quickAccessCards = [
    {
      title: 'Appointments',
      description: 'Schedule and manage patient appointments',
      icon: <AppointmentIcon sx={{ fontSize: 48 }} />,
      path: '/appointments',
      color: '#1976d2',
    },
    {
      title: 'Patients',
      description: 'View and manage patient information',
      icon: <PatientsIcon sx={{ fontSize: 48 }} />,
      path: '/patients',
      color: '#2e7d32',
    },
    {
      title: 'Doctors',
      description: 'Manage doctor profiles and schedules',
      icon: <DoctorsIcon sx={{ fontSize: 48 }} />,
      path: '/doctors',
      color: '#d32f2f',
    },
    {
      title: 'Medical Records',
      description: 'Access patient medical records',
      icon: <MedicalRecordsIcon sx={{ fontSize: 48 }} />,
      path: '/medical-records',
      color: '#ed6c02',
    },
    {
      title: 'Treatment Plans',
      description: 'Create and track treatment plans',
      icon: <TreatmentIcon sx={{ fontSize: 48 }} />,
      path: '/treatment-plans',
      color: '#9c27b0',
    },
    {
      title: 'Clinical Documents',
      description: 'Upload and manage clinical documents',
      icon: <DocumentsIcon sx={{ fontSize: 48 }} />,
      path: '/documents',
      color: '#0288d1',
    },
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 2
          }}
        >
          Clinic Management System
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Welcome! Select a function below to get started
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
          mb: 4,
        }}
      >
        {quickAccessCards.map((card) => (
          <Card
            key={card.path}
            sx={{
              height: '100%',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6,
              },
            }}
          >
            <CardActionArea
              onClick={() => handleCardClick(card.path)}
              sx={{
                height: '100%',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 200,
              }}
            >
              <Box
                sx={{
                  color: card.color,
                  mb: 2,
                }}
              >
                {card.icon}
              </Box>
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {card.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Clinic Management System. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
