import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isEditMode = !!id;

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    address: '',
    isActive: true
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/users');
        // Filter users with doctor role who don't already have a doctor profile
        const doctorUsers = res.data.users.filter(u => u.role === 'doctor');
        setUsers(doctorUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      }
    };

    const fetchDoctor = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        const doctor = res.data.doctor;

        setFormData({
          userId: doctor.userId || '',
          specialization: doctor.specialization || '',
          licenseNumber: doctor.licenseNumber || '',
          phoneNumber: doctor.phoneNumber || '',
          address: doctor.address || '',
          isActive: doctor.isActive !== undefined ? doctor.isActive : true
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    fetchDoctor();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
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
    if (!formData.userId) errors.userId = 'User is required';
    if (!formData.specialization.trim()) errors.specialization = 'Specialization is required';
    if (!formData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/doctors/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/doctors', formData);
      }

      navigate('/doctors');
    } catch (err) {
      console.error('Error saving doctor:', err);
      setError(err.response?.data?.message || 'Failed to save doctor. Please try again later.');
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

  // Check if user has admin role
  if (user && user.role !== 'admin') {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          You don't have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>{isEditMode ? 'Edit Doctor' : 'Add New Doctor'}</h2>
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
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                isInvalid={!!formErrors.userId}
                disabled={isEditMode}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.userId}
              </Form.Control.Feedback>
              {isEditMode && (
                <Form.Text className="text-muted">
                  User cannot be changed after creation.
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                isInvalid={!!formErrors.specialization}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.specialization}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                isInvalid={!!formErrors.licenseNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.licenseNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                isInvalid={!!formErrors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/doctors')} 
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
                {submitting ? 'Saving...' : 'Save Doctor'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DoctorForm;
