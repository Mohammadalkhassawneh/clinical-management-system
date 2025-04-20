import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        
        // Fetch doctor details
        const doctorRes = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(doctorRes.data.doctor);
        
        // Fetch appointments for this doctor
        try {
          const appointmentsRes = await axios.get(`http://localhost:5000/api/appointments`);
          const doctorAppointments = appointmentsRes.data.appointments.filter(
            appointment => appointment.doctorId === parseInt(id)
          );
          setAppointments(doctorAppointments);
        } catch (appointmentErr) {
          console.error('Error fetching appointments:', appointmentErr);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Failed to load doctor details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/doctors/${id}`);
        navigate('/doctors');
      } catch (err) {
        console.error('Error deleting doctor:', err);
        setError('Failed to delete doctor. Please try again later.');
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

  if (!doctor) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Doctor not found or you don't have permission to view this doctor.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Doctor Details</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            className="me-2"
            as={Link}
            to={`/doctors/${id}/edit`}
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
              <h4>Dr. {doctor.User?.firstName} {doctor.User?.lastName}</h4>
              <p className="text-muted">
                {doctor.specialization}
              </p>
              <Badge bg={doctor.isActive ? 'success' : 'danger'}>
                {doctor.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Col>
            <Col md={6} className="text-md-end">
              <p><strong>License Number:</strong> {doctor.licenseNumber}</p>
              <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Details">
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Address:</strong> {doctor.address || 'Not provided'}</p>
                  <p><strong>Email:</strong> {doctor.User?.email || 'Not provided'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Role:</strong> {doctor.User?.role || 'Doctor'}</p>
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
                      <th>Patient</th>
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
                          {appointment.Patient ? 
                            `${appointment.Patient.firstName} ${appointment.Patient.lastName}` : 
                            'Unknown Patient'}
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
                <p>No appointments found for this doctor.</p>
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
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorDetail;
