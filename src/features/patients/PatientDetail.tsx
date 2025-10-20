import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { 
  patientAPI, 
  appointmentService, 
  treatmentPlanService, 
  clinicalDocumentService,
  patientImageService,
  medicalRecordAPI,
} from '../../services/api';
import { Patient, Appointment, TreatmentPlan, ClinicalDocument, PatientImage, MedicalRecord } from '../../types';
import MButton from '../../components/MButton';
import { useAuthContext } from '../../context/useAuthContext';
import { Procedure } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const DoctorPatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [documents, setDocuments] = useState<ClinicalDocument[]>([]);
  const [images, setImages] = useState<PatientImage[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (id) {
      loadPatientData(Number(id));
    }
  }, [id]);

  const loadPatientData = async (patientId: number) => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        patientAPI.getById(patientId),
        appointmentService.getAll(),
        treatmentPlanService.getAll(),
        clinicalDocumentService.getAll(),
        patientImageService.getAll(),
        medicalRecordAPI.getAll(),
        (await import('../../services/api')).procedureService.getAll(),
      ] as const);

      const extractArray = (r: PromiseSettledResult<unknown>): unknown[] => {
        if (r.status !== 'fulfilled') return [];
        const v = r.value as unknown;
        if (Array.isArray(v)) return v;
        if (v && typeof v === 'object') {
          const obj = v as Record<string, unknown>;
          if (Array.isArray(obj.data)) return obj.data as unknown[];
          if (obj.data && typeof obj.data === 'object') {
            const inner = obj.data as Record<string, unknown>;
            if (Array.isArray(inner.data)) return inner.data as unknown[];
          }
        }
        return [];
      };

      const patientResult = results[0];
      const appointmentsResult = results[1];
      const treatmentPlansResult = results[2];
      const documentsResult = results[3];
      const imagesResult = results[4];
      const medicalRecordsResult = results[5];

\      const resolvePatient = (p: unknown): Patient | null => {
        if (!p) return null;
\        const v = p as Record<string, unknown>;
        if ('patient' in v && v.patient && typeof v.patient === 'object') return v.patient as Patient;
        if ('data' in v) {
          const d = v.data as Record<string, unknown> | undefined;
          if (d && 'patient' in d && d.patient && typeof d.patient === 'object') return d.patient as Patient;
          if (d && typeof d === 'object' && !Array.isArray(d) && Object.keys(d).length > 0) return d as unknown as Patient;
        }
        return v as unknown as Patient;
      };

      const normalizedPatient = resolvePatient(patientResult.status === 'fulfilled' ? patientResult.value : null);

  const appointmentsData = (extractArray(appointmentsResult) as Appointment[]).filter((a) => a.patient_id === patientId);
  const treatmentPlansData = (extractArray(treatmentPlansResult) as TreatmentPlan[]).filter((t) => {
    const r = t as unknown as Record<string, unknown>;
    const pid = (r['patient_id'] ?? (r['patient'] && (r['patient'] as Record<string, unknown>)['patient_id'])) as number | undefined;
    return pid === patientId;
  });
      const documentsData = (extractArray(documentsResult) as ClinicalDocument[]).filter((d) => {
    const r = d as unknown as Record<string, unknown>;
    const pid = (r['patient_id'] ?? (r['patient'] && (r['patient'] as Record<string, unknown>)['patient_id'])) as number | undefined;
    return pid === patientId;
  });
      const proceduresResult = results[6];
      let proceduresData: Procedure[] = [];
      if (proceduresResult && proceduresResult.status === 'fulfilled') {
        const rawProcedures = proceduresResult.value as unknown;
        const rp = rawProcedures as unknown as Record<string, unknown>;
        const arr = Array.isArray(rp.data) ? (rp.data as unknown as Procedure[]) : [];
        proceduresData = arr.filter((pr) => {
          const r = pr as unknown as Record<string, unknown>;
          const pid = (r['patient_id'] ?? (r['patient'] && (r['patient'] as Record<string, unknown>)['patient_id'])) as number | undefined;
          return pid === patientId;
        });
      }
  const imagesData = (extractArray(imagesResult) as PatientImage[]).filter((i) => {
    const r = i as unknown as Record<string, unknown>;
    const pid = (r['patient_id'] ?? (r['patient'] && (r['patient'] as Record<string, unknown>)['patient_id'])) as number | undefined;
    return pid === patientId;
  });
  const medicalRecordsData = (extractArray(medicalRecordsResult) as MedicalRecord[]).filter((m) => {
    const r = m as unknown as Record<string, unknown>;
    const pid = (r['patient_id'] ?? (r['patient'] && (r['patient'] as Record<string, unknown>)['patient_id'])) as number | undefined;
    return pid === patientId;
  });

      setPatient(normalizedPatient);
      setAppointments(appointmentsData);
      setTreatmentPlans(treatmentPlansData);
      setDocuments(documentsData);
  setProcedures(proceduresData);
      setImages(imagesData);
      setMedicalRecords(medicalRecordsData);
    } catch (err: unknown) {
      setError('Failed to load patient data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="error">{error || 'Patient not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {patient.full_name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`Gender: ${patient.gender}`} size="small" />
              <Chip label={`Phone: ${patient.phone}`} size="small" />
              {patient.email && <Chip label={`Email: ${patient.email}`} size="small" />}
              <Chip label={`DOB: ${new Date(patient.date_of_birth).toLocaleDateString()}`} size="small" />
              {patient.blood_group && <Chip label={`Blood: ${patient.blood_group}`} size="small" color="error" />}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user?.role === 'doctor' && (
              <>
                <MButton variant="contained" onClick={() => navigate(`/procedures/new?patient_id=${patient.patient_id}`)}>
                  Add Procedure
                </MButton>
                <MButton variant="contained" onClick={() => navigate(`/treatment-plans/new?patient_id=${patient.patient_id}`)}>
                  Add Treatment Plan
                </MButton>
              </>
            )}
            {user?.role === 'staff' && (
              <>
                <MButton variant="outlined" onClick={() => navigate(`/clinical-documents/new?patient_id=${patient.patient_id}`)}>
                  Add Document
                </MButton>
                <MButton variant="outlined" onClick={() => navigate(`/patient-images/new?patient_id=${patient.patient_id}`)}>
                  Add Image
                </MButton>
                <MButton variant="outlined" onClick={() => navigate(`/medical-records/new?patient_id=${patient.patient_id}`)}>
                  Add Record
                </MButton>
              </>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <MButton
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate(`/treatment-plans/new?patient_id=${patient.patient_id}`)}
          >
            Add Treatment Plan
          </MButton>
          <MButton
            variant="contained"
            startIcon={<EventIcon />}
            onClick={() => navigate(`/appointments/new?patient_id=${patient.patient_id}`)}
          >
            Schedule Appointment
          </MButton>
          <MButton
            variant="contained"
            startIcon={<ImageIcon />}
            onClick={() => navigate(`/patient-images?patient_id=${patient.patient_id}`)}
          >
            Add Patient Images
          </MButton>
          <MButton
            variant="outlined"
            startIcon={<LocalHospitalIcon />}
            onClick={() => navigate(`/medical-records/new?patient_id=${patient.patient_id}`)}
          >
            Add Medical Record
          </MButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Appointments (${appointments.length})`} icon={<EventIcon />} iconPosition="start" />
          <Tab label={`Treatment Plans (${treatmentPlans.length})`} icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label={`Procedures (${procedures.length})`} icon={<LocalHospitalIcon />} iconPosition="start" />
          <Tab label={`Medical Records (${medicalRecords.length})`} icon={<LocalHospitalIcon />} iconPosition="start" />
          <Tab label={`Documents (${documents.length})`} icon={<DescriptionIcon />} iconPosition="start" />
          <Tab label={`Images (${images.length})`} icon={<ImageIcon />} iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {appointments.length === 0 ? (
              <Alert severity="info">No appointments found for this patient</Alert>
            ) : (
              appointments.map((appointment) => (
                <Card key={appointment.id} variant="outlined">
                  <CardContent>
                    <Typography variant="h6">
                      Dr. {appointment.doctor.full_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(appointment.appointment_time).toLocaleString()}
                    </Typography>
                    <Chip 
                      label={appointment.status} 
                      size="small" 
                      color={appointment.status === 'completed' ? 'success' : 'default'}
                      sx={{ mt: 1 }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <MButton size="small" onClick={() => navigate(`/appointments/${appointment.id}/edit`)}>
                        Edit
                      </MButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {treatmentPlans.length === 0 ? (
              <Alert severity="info">No treatment plans found for this patient</Alert>
            ) : (
              treatmentPlans.map((plan) => {
                const r = plan as unknown as Record<string, unknown>;
                const doctorObj = r['doctor'] as Record<string, unknown> | undefined;
                const doctorLabel = (doctorObj && (doctorObj.full_name as string)) || `Doctor #${(r['doctor_id'] ?? doctorObj?.patient_id) ?? 'N/A'}`;
                const start = r['start_date'] ? new Date(String(r['start_date'])).toLocaleDateString() : '-';
                const end = r['end_date'] ? new Date(String(r['end_date'])).toLocaleDateString() : '';
                return (
                  <Card key={(r['plan_id'] ?? r['id'] ?? Math.random()) as string | number} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Treatment by Dr. {doctorLabel}</Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {r['treatment_description'] as string}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Start: {start}{end ? ` - End: ${end}` : ''}
                      </Typography>
                      <Chip 
                        label={String(r['status'] ?? '')} 
                        size="small" 
                        color={String(r['status']) === 'completed' ? 'success' : String(r['status']) === 'ongoing' ? 'primary' : 'default'}
                        sx={{ mt: 1 }}
                      />
                      <Box sx={{ mt: 2 }}>
                        <MButton size="small" onClick={() => navigate(`/treatment-plans/${r['plan_id'] ?? r['id']}`)}>
                          View Details
                        </MButton>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {procedures.length === 0 ? (
              <Alert severity="info">No procedures found for this patient</Alert>
            ) : (
              procedures.map((pr) => {
                const r = pr as unknown as Record<string, unknown>;
                const doctorObj = r['doctor'] as Record<string, unknown> | undefined;
                const doctorLabel = (doctorObj && (doctorObj.full_name as string)) || `Doctor #${(r['doctor_id'] ?? doctorObj?.doctor_id) ?? 'N/A'}`;
                const date = r['procedure_date'] ? new Date(String(r['procedure_date'])).toLocaleDateString() : '-';
                return (
                  <Card key={(r['procedure_id'] ?? Math.random()) as string | number} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{r['procedure_name'] as string}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Performed by Dr. {doctorLabel} — {date}
                      </Typography>
                      {r['notes'] && <Typography sx={{ mt: 1 }}>{r['notes'] as string}</Typography>}
                      <Box sx={{ mt: 2 }}>
                        {user?.role === 'doctor' && (
                          <MButton size="small" onClick={() => navigate(`/procedures/${r['procedure_id']}/edit`)}>
                            Manage
                          </MButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {medicalRecords.length === 0 ? (
              <Alert severity="info">No medical records found for this patient</Alert>
            ) : (
              medicalRecords.map((record) => (
                <Card key={record.record_id} variant="outlined">
                  <CardContent>
                    <Typography variant="h6">
                      Visit with Dr. {record.doctor.full_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(record.visit_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </Typography>
                    {record.prescription && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Prescription:</strong> {record.prescription}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2 }}>
                      <MButton size="small" onClick={() => navigate(`/medical-records/${record.record_id}`)}>
                        View Details
                      </MButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {documents.length === 0 ? (
              <Alert severity="info">No documents found for this patient</Alert>
            ) : (
              documents.map((doc) => (
                <Card key={doc.document_id} variant="outlined">
                  <CardContent>
                    <Typography variant="h6">{doc.document_type}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      By: {doc.uploadedByStaff.full_name}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
            {images.length === 0 ? (
              <Alert severity="info">No images found for this patient</Alert>
            ) : (
              images.map((image) => (
                <Card key={image.image_id} variant="outlined">
                  <CardContent>
                    <Typography variant="body2" fontWeight={600}>
                      {image.image_type}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(image.upload_date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </TabPanel>

        <Box sx={{ mt: 3 }}>
          <MButton onClick={() => navigate('/patients')}>Back to Patients</MButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorPatientDetail;
