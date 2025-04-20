import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    patientCount: 0,
    doctorCount: 0,
    appointmentCount: 0,
    todayAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient count
        const patientsRes = await axios.get('http://localhost:5000/api/patients');
        
        // Fetch doctor count
        const doctorsRes = await axios.get('http://localhost:5000/api/doctors');
        
        // Fetch appointments
        const appointmentsRes = await axios.get('http://localhost:5000/api/appointments');
        
        // Calculate today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointmentsRes.data.appointments.filter(
          appointment => appointment.appointmentDate === today
        );
        
        // Set stats
        setStats({
          patientCount: patientsRes.data.patients.length,
          doctorCount: doctorsRes.data.doctors.length,
          appointmentCount: appointmentsRes.data.appointments.length,
          todayAppointments: todayAppointments.length
        });
        
        // Set recent appointments (last 5)
        setRecentAppointments(
          appointmentsRes.data.appointments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Dashboard</h2>
      
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      
      <Row>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text className="display-4">{stats.patientCount}</Card.Text>
              <Button as={Link} to="/patients" variant="outline-primary">View Patients</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Doctors</Card.Title>
              <Card.Text className="display-4">{stats.doctorCount}</Card.Text>
              <Button as={Link} to="/doctors" variant="outline-primary">View Doctors</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <Card.Text className="display-4">{stats.appointmentCount}</Card.Text>
              <Button as={Link} to="/appointments" variant="outline-primary">View Appointments</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Today's Appointments</Card.Title>
              <Card.Text className="display-4">{stats.todayAppointments}</Card.Text>
              <Button as={Link} to="/appointments" variant="outline-primary">View Today's Schedule</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Recent Appointments</h5>
            </Card.Header>
            <Card.Body>
              {recentAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAppointments.map(appointment => (
                        <tr key={appointment.id}>
                          <td>{appointment.Patient?.firstName} {appointment.Patient?.lastName}</td>
                          <td>Dr. {appointment.Doctor?.User?.firstName} {appointment.Doctor?.User?.lastName}</td>
                          <td>{appointment.appointmentDate}</td>
                          <td>{appointment.appointmentTime}</td>
                          <td>
                            <span className={`badge bg-${
                              appointment.status === 'completed' ? 'success' :
                              appointment.status === 'cancelled' ? 'danger' :
                              appointment.status === 'no-show' ? 'warning' : 'primary'
                            }`}>
                              {appointment.status}
                            </span>
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
                  </table>
                </div>
              ) : (
                <p className="text-center">No recent appointments found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
