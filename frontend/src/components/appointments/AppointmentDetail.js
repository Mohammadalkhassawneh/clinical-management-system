import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        setLoading(true);

        // Fetch appointment details
        const res = await axios.get(`http://localhost:5000/api/appointments/${id}`);
        setAppointment(res.data.appointment);

        setError(null);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to load appointment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        navigate('/appointments');
      } catch (err) {
        console.error('Error deleting appointment:', err);
        setError('Failed to delete appointment. Please try again later.');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, {
        ...appointment,
        status: newStatus
      });

      // Update local state
      setAppointment({
        ...appointment,
        status: newStatus
      });
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status. Please try again later.');
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

  if (!appointment) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Appointment not found or you don't have permission to view this appointment.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Appointment Details</h2>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-primary"
            className="me-2"
            as={Link}
            to={`/appointments/${id}/edit`}
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
              <h4>
                <Badge bg={
                  appointment.status === 'completed' ? 'success' :
                  appointment.status === 'cancelled' ? 'danger' :
                  appointment.status === 'no-show' ? 'warning' : 'primary'
                }>
                  {appointment.status}
                </Badge>
              </h4>
              <p className="mt-3">
                <strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {appointment.appointmentTime}
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              {appointment.status === 'scheduled' && (
                <div className="mb-3">
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="me-2"
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleStatusChange('no-show')}
                  >
                    No Show
                  </Button>
                </div>
              )}
              {appointment.status !== 'scheduled' && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleStatusChange('scheduled')}
                >
                  Revert to Scheduled
                </Button>
              )}
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Details">
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Patient</h5>
                  {appointment.Patient ? (
                    <p>
                      <Link to={`/patients/${appointment.Patient.id}`}>
                        {appointment.Patient.firstName} {appointment.Patient.lastName}
                      </Link>
                      <br />
                      <small className="text-muted">
                        Phone: {appointment.Patient.phoneNumber}
                        {appointment.Patient.email && <>, Email: {appointment.Patient.email}</>}
                      </small>
                    </p>
                  ) : (
                    <p>Unknown Patient</p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Doctor</h5>
                  {appointment.Doctor && appointment.Doctor.User ? (
                    <p>
                      <Link to={`/doctors/${appointment.Doctor.id}`}>
                        Dr. {appointment.Doctor.User.firstName} {appointment.Doctor.User.lastName}
                      </Link>
                      <br />
                      <small className="text-muted">
                        Specialization: {appointment.Doctor.specialization}
                      </small>
                    </p>
                  ) : (
                    <p>Unknown Doctor</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Reason for Visit</h5>
                  <p>{appointment.reasonForVisit || 'No reason provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Notes</h5>
                  <p>{appointment.notes || 'No notes available'}</p>
                </Col>
              </Row>
              {appointment.status === 'completed' && (
                <div className="text-end mt-3">
                  <Button
                    as={Link}
                    to={`/reports/new`}
                    variant="primary"
                    size="sm"
                  >
                    Create Medical Report
                  </Button>
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AppointmentDetail;
