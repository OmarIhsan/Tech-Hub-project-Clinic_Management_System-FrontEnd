import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box } from '@mui/material';
import DoctorForm from '../doctors/DoctorForm';
import StaffAddWorkflow from '../staff/StaffAddWorkflow';

interface EmployeeAddDialogProps {
  open: boolean;
  onClose: () => void;
}

const EmployeeAddDialog: React.FC<EmployeeAddDialogProps> = ({ open, onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Employee</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Doctor" />
          <Tab label="Staff Member" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {tab === 0 && <DoctorForm />}
          {tab === 1 && <StaffAddWorkflow />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeAddDialog;
