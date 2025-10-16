import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider
} from '@mui/material';
import { FormInput, SelectField, DatePicker, FileUpload } from '../../components';

const FormComponentsDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    priority: '',
    startDate: '',
    endDate: '',
    files: []
  });

  const handleInputChange = (field) => (event) => {
    const value = event.target ? event.target.value : event;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilesChange = (files) => {
    setFormData(prev => ({
      ...prev,
      files
    }));
  };

  const categoryOptions = [
    { value: 'medical', label: 'Medical' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'billing', label: 'Billing' },
    { value: 'other', label: 'Other' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    alert('Check console for form data');
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      category: '',
      priority: '',
      startDate: '',
      endDate: '',
      files: []
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Form Components Demo
      </Typography>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Reusable Form Components
          </Typography>
          
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              FormInput Component
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <FormInput
                label="Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                placeholder="Enter your name"
                required
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="Enter your email"
                helperText="We'll never share your email"
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              SelectField Component
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <SelectField
                label="Category"
                value={formData.category}
                onChange={handleInputChange('category')}
                options={categoryOptions}
                placeholder="Choose a category"
                required
                error={false}
                helperText=""
              />
              
              <SelectField
                label="Priority"
                value={formData.priority}
                onChange={handleInputChange('priority')}
                options={priorityOptions}
                placeholder="Select priority level"
                error={false}
                helperText=""
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              DatePicker Component
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleInputChange('startDate')}
                required
                error={false}
                helperText=""
                minDate=""
                maxDate=""
              />
              
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleInputChange('endDate')}
                minDate={formData.startDate}
                error={false}
                helperText=""
                maxDate=""
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              FileUpload Component
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <FileUpload
                onFilesChange={handleFilesChange}
                acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                maxFileSize={5 * 1024 * 1024} 
                maxFiles={3}
                multiple={true}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!formData.name || !formData.category}
              >
                Submit Form
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Form Data
          </Typography>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '14px'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormComponentsDemo;