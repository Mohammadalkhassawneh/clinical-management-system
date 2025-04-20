import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FileAttachmentList from '../common/FileAttachmentList';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalReports, setMedicalReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient details
        const patientRes = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(patientRes.data.patient);
        
        // Get patient's appointments
        if (patientRes.data.patient.Appointments) {
          setAppointments(patientRes.data.patient.Appointments);
        }
        
        // Fetch medical reports
        try {
          const reportsRes = await axios.get(`http://localhost:5000/api/medical-reports`);
          const patientReports = reportsRes.data.medicalReports.filter(
            report => report.patientId === parseInt(id)
          );
          setMedicalReports(patientReports);
        } catch (reportErr) {
          console.error('Error fetching medical reports:', reportErr);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Failed to load patient details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/patients/${id}`);
        navigate('/patients');
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Failed to delete patient. Please try again later.');
      }
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

  if (!patient) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Patient not found or you don't have permission to view this patient.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Patient Details</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            className="me-2"
            as={Link}
            to={`/patients/${id}/edit`}
          >
            Edit
          </Button>
          <Button 
            variant="outline-danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{patient.firstName} {patient.lastName}</h4>
              <p className="text-muted">
                {patient.gender}, {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Unknown DOB'}
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <p><strong>Phone:</strong> {patient.phoneNumber}</p>
              <p><strong>Email:</strong> {patient.email || 'Not provided'}</p>
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Personal Details">
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Address:</strong> {patient.address || 'Not provided'}</p>
                  <p><strong>Blood Type:</strong> {patient.bloodType || 'Not recorded'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Emergency Contact:</strong> {patient.emergencyContactName || 'Not provided'}</p>
                  <p><strong>Emergency Phone:</strong> {patient.emergencyContactPhone || 'Not provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Allergies</h5>
                  <p>{patient.allergies || 'No allergies recorded'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Medical History</h5>
                  <p>{patient.medicalHistory || 'No medical history recorded'}</p>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="appointments" title="Appointments">
              {appointments.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Doctor</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                        <td>{appointment.appointmentTime}</td>
                        <td>
                          {appointment.Doctor?.User ? 
                            `Dr. ${appointment.Doctor.User.firstName} ${appointment.Doctor.User.lastName}` : 
                            'Unknown Doctor'}
                        </td>
                        <td>
                          <Badge bg={
                            appointment.status === 'completed' ? 'success' :
                            appointment.status === 'cancelled' ? 'danger' :
                            appointment.status === 'no-show' ? 'warning' : 'primary'
                          }>
                            {appointment.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/appointments/${appointment.id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No appointments found for this patient.</p>
              )}
              <div className="text-end">
                <Button
                  as={Link}
                  to={`/appointments/new`}
                  variant="primary"
                  size="sm"
                >
                  Schedule New Appointment
                </Button>
              </div>
            </Tab>
            <Tab eventKey="reports" title="Medical Reports">
              {medicalReports.length > 0 ? (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Doctor</th>
                      <th>Diagnosis</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalReports.map(report => (
                      <tr key={report.id}>
                        <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                        <td>
                          {report.Doctor?.User ? 
                            `Dr. ${report.Doctor.User.firstName} ${report.Doctor.User.lastName}` : 
                            'Unknown Doctor'}
                        </td>
                        <td>{report.diagnosis.substring(0, 50)}...</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/reports/${report.id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No medical reports found for this patient.</p>
              )}
              <div className="text-end">
                <Button
                  as={Link}
                  to={`/reports/new`}
                  variant="primary"
                  size="sm"
                >
                  Create New Report
                </Button>
              </div>
            </Tab>
            <Tab eventKey="files" title="File Attachments">
              <FileAttachmentList entityType="patient" entityId={id} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PatientDetail;
