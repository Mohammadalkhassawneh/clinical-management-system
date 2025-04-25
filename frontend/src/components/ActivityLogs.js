import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    userId: ''
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/activity-logs', {
        params: filters
      });
      setLogs(response.data.logs);
      console.log('Fetched logs:', response.data.logs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users');
        console.log('Fetched users:', response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadge = (action) => {
    switch(action) {
      case 'create':
        return <Badge bg="success">Create</Badge>;
      case 'update':
        return <Badge bg="warning">Update</Badge>;
      case 'delete':
        return <Badge bg="danger">Delete</Badge>;
      case 'login':
        return <Badge bg="info">Login</Badge>;
      default:
        return <Badge bg="secondary">{action}</Badge>;
    }
  };

  const getEntityTypeLabel = (type) => {
    switch(type) {
      case 'User':
        return 'User';
      case 'Patient':
        return 'Patient';
      case 'Doctor':
        return 'Doctor';
      case 'Appointment':
        return 'Appointment';
      case 'MedicalReport':
        return 'Medical Report';
      default:
        return type;
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Activity Logs</h1>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={applyFilters}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Action Type</Form.Label>
                  <Form.Select
                    name="action"
                    value={filters.action}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="login">Login</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Entity Type</Form.Label>
                  <Form.Select
                    name="entityType"
                    value={filters.entityType}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="User">User</option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Appointment">Appointment</option>
                    <option value="MedicalReport">Medical Report</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    name="userId"
                    value={filters.userId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">Apply Filters</button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <Spinner />
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>{log.userId ? getUserName(log.userId) : 'System'}</td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>{getEntityTypeLabel(log.entityType)}</td>
                    <td>{log.entityId}</td>
                    <td>{log.ipAddress}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No activity logs found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ActivityLogs;