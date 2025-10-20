import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { patientImageService, patientAPI } from '../../services/api';
import { Patient } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';

interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId?: number | null;
}

const IMAGE_TYPES = [
  'X-Ray',
  'MRI',
  'CT-Scan',
  'Ultrasound',
  'Photo',
  'Scan',
  'Other',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onClose,
  onSuccess,
  patientId = null,
}) => {
  const [formData, setFormData] = useState({
    patientId: patientId?.toString() || '',
    imageType: '',
    notes: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (open) {
      fetchPatients();
      setFormData({
        patientId: patientId?.toString() || '',
        imageType: '',
        notes: '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setError('');
      setSuccess('');
    }
  }, [open, patientId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchPatients = async () => {
    try {
      setFetchingPatients(true);
      const patientsData = await patientAPI.getAll();
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
      setError('Failed to load patients list');
    } finally {
      setFetchingPatients(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl('');
      setError('');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
    setError('');

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const validateForm = (): boolean => {
    if (!formData.patientId) {
      setError('Please select a patient');
      return false;
    }
    if (!formData.imageType) {
      setError('Please select an image type');
      return false;
    }
    if (!selectedFile) {
      setError('Please select an image file');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await patientImageService.upload(selectedFile!, {
        patientId: formData.patientId,
        imageType: formData.imageType,
        notes: formData.notes || undefined,
      });

      setSuccess('Image uploaded successfully!');
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: unknown) {
      console.error('Failed to upload image:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                          (err as { message?: string })?.message || 
                          'Failed to upload image';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Upload Patient Image</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => option.full_name || ''}
              value={patients.find(p => p.patient_id.toString() === formData.patientId) || null}
              onChange={(_, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  patientId: newValue?.patient_id.toString() || '',
                }));
                setError('');
              }}
              loading={fetchingPatients}
              disabled={Boolean(patientId) || loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Patient *"
                  placeholder="Search and select patient"
                  error={!formData.patientId && error !== ''}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {fetchingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option.patient_id === value.patient_id}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Image Type *</InputLabel>
              <Select
                value={formData.imageType}
                label="Image Type *"
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    imageType: e.target.value,
                  }));
                  setError('');
                }}
                disabled={loading}
              >
                {IMAGE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<UploadIcon />}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {selectedFile ? selectedFile.name : 'Select Image File'}
              <input
                type="file"
                hidden
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Allowed: JPEG, PNG, GIF, WebP • Max size: 5MB
            </Typography>
          </Box>

          {previewUrl && (
            <Box
              sx={{
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <Box
                component="img"
                src={previewUrl}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}

          {!previewUrl && (
            <Box
              sx={{
                mb: 2,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 1,
                p: 4,
                textAlign: 'center',
                bgcolor: 'grey.50',
              }}
            >
              <ImageIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No image selected
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="Notes (Optional)"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                notes: e.target.value,
              }));
            }}
            disabled={loading}
            placeholder="Additional notes or observations..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <MOutlineButton
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </MOutlineButton>
        <MButton
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </MButton>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;
