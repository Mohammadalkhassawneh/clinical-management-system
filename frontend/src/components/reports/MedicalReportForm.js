import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MedicalReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    reportDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
    followUpDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch patients
        const patientsRes = await axios.get('http://localhost:5000/api/patients');
        setPatients(patientsRes.data.patients);
        
        // Fetch doctors
        const doctorsRes = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(doctorsRes.data.doctors);
        
        // If edit mode, fetch report details
        if (isEditMode) {
          const reportRes = await axios.get(`http://localhost:5000/api/medical-reports/${id}`);
          const report = reportRes.data.medicalReport;
          
          // Format dates to YYYY-MM-DD for input
          const formattedReportDate = report.reportDate ? 
            new Date(report.reportDate).toISOString().split('T')[0] : '';
          
          const formattedFollowUpDate = report.followUpDate ? 
            new Date(report.followUpDate).toISOString().split('T')[0] : '';
          
          setFormData({
            patientId: report.patientId || '',
            doctorId: report.doctorId || '',
            reportDate: formattedReportDate,
            diagnosis: report.diagnosis || '',
            treatment: report.treatment || '',
            prescription: report.prescription || '',
            notes: report.notes || '',
            followUpDate: formattedFollowUpDate
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientId) errors.patientId = 'Patient is required';
    if (!formData.doctorId) errors.doctorId = 'Doctor is required';
    if (!formData.reportDate) errors.reportDate = 'Report date is required';
    if (!formData.diagnosis.trim()) errors.diagnosis = 'Diagnosis is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/medical-reports/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/medical-reports', formData);
      }

      navigate('/reports');
    } catch (err) {
      console.error('Error saving medical report:', err);
      setError(err.response?.data?.message || 'Failed to save medical report. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>{isEditMode ? 'Edit Medical Report' : 'Create New Medical Report'}</h2>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient</Form.Label>
                  <Form.Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    isInvalid={!!formErrors.patientId}
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.patientId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    isInvalid={!!formErrors.doctorId}
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.User?.firstName} {doctor.User?.lastName} ({doctor.specialization})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.doctorId}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="reportDate"
                    value={formData.reportDate}
                    onChange={handleChange}
                    isInvalid={!!formErrors.reportDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.reportDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Follow-up Date (if needed)</Form.Label>
                  <Form.Control
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                isInvalid={!!formErrors.diagnosis}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.diagnosis}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Treatment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prescription</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/reports')} 
                className="me-2"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Report' : 'Create Report'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MedicalReportForm;
