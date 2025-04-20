import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/appointments');
        setAppointments(res.data.appointments);
        setFilteredAppointments(res.data.appointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filter);
    }
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        (appointment.Patient && `${appointment.Patient.firstName} ${appointment.Patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.Doctor && appointment.Doctor.User && `${appointment.Doctor.User.firstName} ${appointment.Doctor.User.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.reasonForVisit && appointment.reasonForVisit.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredAppointments(filtered);
  }, [searchTerm, filter, appointments]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
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
          <h2>Appointments</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/appointments/new" variant="primary">
            Schedule New Appointment
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
          <Row className="mb-3">
            <Col md={8}>
              <Form.Control
                type="text"
                placeholder="Search by patient, doctor, or reason"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Col>
            <Col md={4}>
              <Form.Select value={filter} onChange={handleFilterChange}>
                <option value="all">All Appointments</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </Form.Select>
            </Col>
          </Row>

          {filteredAppointments.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                      <td>{appointment.appointmentTime}</td>
                      <td>
                        {appointment.Patient ? 
                          <Link to={`/patients/${appointment.Patient.id}`}>
                            {appointment.Patient.firstName} {appointment.Patient.lastName}
                          </Link> : 
                          'Unknown Patient'}
                      </td>
                      <td>
                        {appointment.Doctor && appointment.Doctor.User ? 
                          <Link to={`/doctors/${appointment.Doctor.id}`}>
                            Dr. {appointment.Doctor.User.firstName} {appointment.Doctor.User.lastName}
                          </Link> : 
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
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          to={`/appointments/${appointment.id}/edit`}
                          variant="outline-secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center">No appointments found</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AppointmentList;
