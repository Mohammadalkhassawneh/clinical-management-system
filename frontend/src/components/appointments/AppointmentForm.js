import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'scheduled',
    reasonForVisit: '',
    notes: ''
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

        // If edit mode, fetch appointment details
        if (isEditMode) {
          const appointmentRes = await axios.get(`http://localhost:5000/api/appointments/${id}`);
          const appointment = appointmentRes.data.appointment;

          // Format date to YYYY-MM-DD for input
          const formattedDate = appointment.appointmentDate ?
            new Date(appointment.appointmentDate).toISOString().split('T')[0] : '';

          setFormData({
            patientId: appointment.patientId || '',
            doctorId: appointment.doctorId || '',
            appointmentDate: formattedDate,
            appointmentTime: appointment.appointmentTime || '',
            status: appointment.status || 'scheduled',
            reasonForVisit: appointment.reasonForVisit || '',
            notes: appointment.notes || ''
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
    if (!formData.appointmentDate) errors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) errors.appointmentTime = 'Time is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/appointments/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/appointments', formData);
      }

      navigate('/appointments');
    } catch (err) {
      console.error('Error saving appointment:', err);
      setError(err.response?.data?.message || 'Failed to save appointment. Please try again later.');
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
          <h2>{isEditMode ? 'Edit Appointment' : 'Schedule New Appointment'}</h2>
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
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    isInvalid={!!formErrors.appointmentDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.appointmentDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    isInvalid={!!formErrors.appointmentTime}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.appointmentTime}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {isEditMode && (
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Notes</Form.Label>
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
                onClick={() => navigate('/appointments')}
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
                {submitting ? 'Saving...' : isEditMode ? 'Update Appointment' : 'Schedule Appointment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AppointmentForm;
