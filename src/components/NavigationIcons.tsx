import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import { StaffRole } from '../types';

const getTabValue = (pathname: string, role?: StaffRole): number => {
  if (pathname === '/' || pathname.includes('/dashboard')) return 0;
  
  if (role === StaffRole.STAFF) {
    if (pathname.includes('/staff/add')) return 1;
    if (pathname.includes('/staff/update')) return 2;
    return 0;
  }
  
  if (role === StaffRole.DOCTOR) {
    if (pathname.includes('/patients')) return 1;
    if (pathname.includes('/appointments')) return 2;
    if (pathname.includes('/procedures')) return 3;
    return 0;
  }

  if (pathname.includes('/patients')) return 1;
  if (pathname.includes('/doctors')) return 2;
  if (pathname.includes('/appointments')) return 3;
  if (pathname.includes('/treatment-plans')) return 4;
  if (pathname.includes('/documents')) return 5;
  
  return 0;
};

const NavigationIcons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [value, setValue] = React.useState(getTabValue(location.pathname, user?.role));

  React.useEffect(() => {
    setValue(getTabValue(location.pathname, user?.role));
  }, [location.pathname, user?.role]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
    if (newValue === 0) {
      navigate('/');
      return;
    }
    
    if (user?.role === StaffRole.STAFF) {
      switch (newValue) {
        case 1:
          navigate('/staff/add');
          break;
        case 2:
          navigate('/staff/update');
          break;
      }
      return;
    }
    
    if (user?.role === StaffRole.DOCTOR) {
      switch (newValue) {
        case 1:
          navigate('/patients');
          break;
        case 2:
          navigate('/appointments');
          break;
        case 3:
          navigate('/procedures');
          break;
      }
      return;
    }
    
    switch (newValue) {
      case 1:
        navigate('/patients');
        break;
      case 2:
        navigate('/doctors');
        break;
      case 3:
        navigate('/appointments');
        break;
      case 4:
        navigate('/treatment-plans');
        break;
      case 5:
        navigate('/documents');
        break;
    }
  };

  const renderNavigation = () => {
    if (user?.role === StaffRole.STAFF) {
      return (
        <>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Add" icon={<AddIcon />} />
          <BottomNavigationAction label="Update" icon={<EditIcon />} />
        </>
      );
    }
    
    if (user?.role === StaffRole.DOCTOR) {
      return (
        <>
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Patients" icon={<PeopleIcon />} />
          <BottomNavigationAction label="Appointments" icon={<EventNoteIcon />} />
          <BottomNavigationAction label="Procedures" icon={<MedicalServicesIcon />} />
        </>
      );
    }
    
    return (
      <>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Patients" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Doctors" icon={<LocalHospitalIcon />} />
        <BottomNavigationAction label="Appointments" icon={<EventNoteIcon />} />
        <BottomNavigationAction label="Treatments" icon={<AssignmentIcon />} />
        <BottomNavigationAction label="Documents" icon={<DescriptionIcon />} />
      </>
    );
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {renderNavigation()}
      </BottomNavigation>
    </Paper>
  );
};

export default NavigationIcons;