import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/doctors');
        setDoctors(res.data.doctors);
        setFilteredDoctors(res.data.doctors);
        setError(null);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(doctor =>
        `${doctor.User?.firstName} ${doctor.User?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.licenseNumber.includes(searchTerm) ||
        doctor.phoneNumber.includes(searchTerm)
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
          <h2>Doctors</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/doctors/new" variant="primary">
            Add New Doctor
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by name, specialization, license, or phone"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
          </Form>

          {filteredDoctors.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>License Number</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map(doctor => (
                    <tr key={doctor.id}>
                      <td>Dr. {doctor.User?.firstName} {doctor.User?.lastName}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.licenseNumber}</td>
                      <td>{doctor.phoneNumber}</td>
                      <td>
                        <span className={`badge bg-${doctor.isActive ? 'success' : 'danger'}`}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/doctors/${doctor.id}`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          to={`/doctors/${doctor.id}/edit`}
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
            <p className="text-center">No doctors found</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorList;
