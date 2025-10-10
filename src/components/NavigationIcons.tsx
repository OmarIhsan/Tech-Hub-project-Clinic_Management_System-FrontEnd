import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate, useLocation } from 'react-router-dom';
// useState is imported via React namespace

const getTabValue = (pathname) => {
  if (pathname.includes('/patients')) return 1;
  if (pathname.includes('/doctors')) return 2;
  if (pathname.includes('/treatment-plans')) return 3;
  return 0; // default to appointments
};

const NavigationIcons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(getTabValue(location.pathname));

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/appointments');
        break;
      case 1:
        navigate('/patients');
        break;
      case 2:
        navigate('/doctors');
        break;
      case 3:
        navigate('/treatment-plans');
        break;
      default:
        break;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Appointments" icon={<EventNoteIcon />} />
        <BottomNavigationAction label="Patients" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Doctors" icon={<LocalHospitalIcon />} />
        <BottomNavigationAction label="Treatment Plans" icon={<AssignmentIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default NavigationIcons;