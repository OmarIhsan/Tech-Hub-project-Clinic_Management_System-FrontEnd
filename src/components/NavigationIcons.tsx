import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NavigationIcons = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/patients');
        break;
      case 2:
        navigate('/doctors');
        break;
      case 3:
        navigate('/appointments');
        break;
      default:
        break;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Patients" icon={<PeopleIcon />} />
        <BottomNavigationAction label="Doctors" icon={<LocalHospitalIcon />} />
        <BottomNavigationAction label="Appointments" icon={<EventNoteIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default NavigationIcons;