import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MedicalReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/medical-reports');
        setReports(res.data.medicalReports);
        setFilteredReports(res.data.medicalReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching medical reports:', err);
        setError('Failed to load medical reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = reports.filter(report => 
        (report.Patient && `${report.Patient.firstName} ${report.Patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.Doctor && report.Doctor.User && `${report.Doctor.User.firstName} ${report.Doctor.User.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.diagnosis && report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.treatment && report.treatment.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredReports(filtered);
    } else {
      setFilteredReports(reports);
    }
  }, [searchTerm, reports]);

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
          <h2>Medical Reports</h2>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/reports/new" variant="primary">
            Create New Report
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
                placeholder="Search by patient, doctor, diagnosis, or treatment"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Form.Group>
          </Form>

          {filteredReports.length > 0 ? (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Diagnosis</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map(report => (
                    <tr key={report.id}>
                      <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                      <td>
                        {report.Patient ? 
                          <Link to={`/patients/${report.Patient.id}`}>
                            {report.Patient.firstName} {report.Patient.lastName}
                          </Link> : 
                          'Unknown Patient'}
                      </td>
                      <td>
                        {report.Doctor && report.Doctor.User ? 
                          <Link to={`/doctors/${report.Doctor.id}`}>
                            Dr. {report.Doctor.User.firstName} {report.Doctor.User.lastName}
                          </Link> : 
                          'Unknown Doctor'}
                      </td>
                      <td>{report.diagnosis.substring(0, 50)}...</td>
                      <td>
                        <Button
                          as={Link}
                          to={`/reports/${report.id}`}
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          to={`/reports/${report.id}/edit`}
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
            <p className="text-center">No medical reports found</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MedicalReportList;
