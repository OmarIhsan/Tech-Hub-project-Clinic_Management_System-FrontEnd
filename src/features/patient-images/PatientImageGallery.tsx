import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { patientImageService, patientAPI } from '../../services/api';
import { PatientImage, Patient } from '../../types';
import MButton from '../../components/MButton';
import MOutlineButton from '../../components/MOutlineButton';
import ImageUploadDialog from './ImageUploadDialog';

const PatientImageGallery = () => {
  const [images, setImages] = useState<PatientImage[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [filterPatient, setFilterPatient] = useState<string>('');
  const [filterImageType, setFilterImageType] = useState<string>('');
  
  // Preview Modal
  const [previewImage, setPreviewImage] = useState<PatientImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Upload Dialog
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Delete Confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<PatientImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [imagesResponse, patientsData] = await Promise.all([
        patientImageService.getAll(),
        patientAPI.getAll(),
      ]);
      
      const imagesList = imagesResponse.data || [];
      setImages(Array.isArray(imagesList) ? imagesList : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load patient images. Please try again.');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewOpen = (image: PatientImage) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleDeleteClick = (image: PatientImage) => {
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      setDeleting(true);
      await patientImageService.delete(imageToDelete.image_id.toString());
      setImages(images.filter(img => img.image_id !== imageToDelete.image_id));
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = (image: PatientImage) => {
    // In a real implementation, this would download the actual file
    const link = document.createElement('a');
    link.href = image.file_path;
    link.download = `patient-${image.patient.patient_id}-${image.image_type}-${image.image_id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSuccess = () => {
    fetchData();
    setUploadDialogOpen(false);
  };

  // Filter images
  const filteredImages = images.filter((image) => {
    const matchesPatient = !filterPatient || 
      image.patient?.patient_id === Number(filterPatient);
    
    const matchesType = !filterImageType || 
      image.image_type === filterImageType;

    return matchesPatient && matchesType;
  });

  // Get unique image types for filter
  const imageTypes = Array.from(new Set(images.map(img => img.image_type))).filter(Boolean);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Patient Images
        </Typography>
        <MButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Image
        </MButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Patient</InputLabel>
              <Select
                value={filterPatient}
                label="Filter by Patient"
                onChange={(e) => setFilterPatient(e.target.value)}
              >
                <MenuItem value="">All Patients</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.patient_id} value={patient.patient_id}>
                    {patient.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Filter by Image Type</InputLabel>
              <Select
                value={filterImageType}
                label="Filter by Image Type"
                onChange={(e) => setFilterImageType(e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {imageTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {(filterPatient || filterImageType) && (
            <Button
              size="small"
              onClick={() => {
                setFilterPatient('');
                setFilterImageType('');
              }}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <ImageIcon sx={{ fontSize: 80, color: 'action.disabled', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {images.length === 0 ? 'No Images Found' : 'No Images Match Filters'}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {images.length === 0 
                  ? "Upload your first patient image to get started"
                  : "Try adjusting your filters"}
              </Typography>
              {images.length === 0 && (
                <MButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setUploadDialogOpen(true)}
                  sx={{ mt: 2 }}
                >
                  Upload First Image
                </MButton>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredImages.map((image) => (
            <Card 
              key={image.image_id}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundImage: `url(${image.file_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => handlePreviewOpen(image)}
                >
                  {!image.file_path && (
                    <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 1,
                        bgcolor: 'rgba(0,0,0,0.5)',
                      },
                    }}
                  >
                    <ZoomInIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="div" noWrap>
                      {image.patient?.full_name || `Patient #${image.patient?.patient_id}`}
                    </Typography>
                    <Chip 
                      label={image.image_type} 
                      size="small" 
                      color="primary"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Uploaded: {new Date(image.upload_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    By: {image.uploadedByStaff?.full_name || 'Unknown'}
                  </Typography>
                  
                  <Box display="flex" gap={1} mt={2}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handlePreviewOpen(image)}
                      title="View"
                    >
                      <ZoomInIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleDownload(image)}
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(image)}
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
          ))}
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Image Preview</Typography>
            <IconButton onClick={handlePreviewClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box>
              <Box
                component="img"
                src={previewImage.file_path}
                alt={previewImage.image_type}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  bgcolor: 'grey.100',
                }}
              />
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Patient:</strong> {previewImage.patient?.full_name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Image Type:</strong> {previewImage.image_type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Upload Date:</strong> {new Date(previewImage.upload_date).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Uploaded By:</strong> {previewImage.uploadedByStaff?.full_name}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <MOutlineButton onClick={handlePreviewClose}>
            Close
          </MOutlineButton>
          {previewImage && (
            <MButton
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => previewImage && handleDownload(previewImage)}
            >
              Download
            </MButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this image? This action cannot be undone.
          </Typography>
          {imageToDelete && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Patient:</strong> {imageToDelete.patient?.full_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong> {imageToDelete.image_type}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <MOutlineButton
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </MOutlineButton>
          <MButton
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </MButton>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <ImageUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </Container>
  );
};

export default PatientImageGallery;
