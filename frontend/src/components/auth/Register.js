import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    firstName: '',
    lastName: '',
    role: 'receptionist' // Default role
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password, confirmPassword, email, firstName, lastName, role } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const userData = {
      username,
      password,
      email,
      firstName,
      lastName,
      role
    };
    
    const result = await register(userData);
    if (result.success) {
      navigate('/login');
    } else {
      setErrorMessage(result.error);
      setShowError(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Clinic Management System</h2>
              <h4 className="text-center mb-4">Register New User</h4>
              
              {showError && errorMessage && (
                <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                  {errorMessage}
                </Alert>
              )}
              
              <Form onSubmit={onSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        isInvalid={!!formErrors.username}
                        placeholder="Enter username"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        isInvalid={!!formErrors.email}
                        placeholder="Enter email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={onChange}
                        isInvalid={!!formErrors.firstName}
                        placeholder="Enter first name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={onChange}
                        isInvalid={!!formErrors.lastName}
                        placeholder="Enter last name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        isInvalid={!!formErrors.password}
                        placeholder="Enter password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        isInvalid={!!formErrors.confirmPassword}
                        placeholder="Confirm password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={role}
                    onChange={onChange}
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="admin">Admin</option>
                  </Form.Select>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/login')}
                  >
                    Back to Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
