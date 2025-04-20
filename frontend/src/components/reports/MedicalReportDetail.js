import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FileAttachmentList from '../common/FileAttachmentList';

const MedicalReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch report details
        const res = await axios.get(`http://localhost:5000/api/medical-reports/${id}`);
        setReport(res.data.medicalReport);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching medical report details:', err);
        setError('Failed to load medical report details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this medical report? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/medical-reports/${id}`);
        navigate('/reports');
      } catch (err) {
        console.error('Error deleting medical report:', err);
        setError('Failed to delete medical report. Please try again later.');
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

  if (!report) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Medical report not found or you don't have permission to view this report.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Medical Report</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            className="me-2"
            as={Link}
            to={`/reports/${id}/edit`}
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
              <h4>Medical Report #{report.id}</h4>
              <p className="text-muted">
                Date: {new Date(report.reportDate).toLocaleDateString()}
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              {report.followUpDate && (
                <p>
                  <Badge bg="info">
                    Follow-up Date: {new Date(report.followUpDate).toLocaleDateString()}
                  </Badge>
                </p>
              )}
            </Col>
          </Row>
          <hr />
          <Tabs defaultActiveKey="details" className="mb-3">
            <Tab eventKey="details" title="Report Details">
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Patient</h5>
                  {report.Patient ? (
                    <p>
                      <Link to={`/patients/${report.Patient.id}`}>
                        {report.Patient.firstName} {report.Patient.lastName}
                      </Link>
                      <br />
                      <small className="text-muted">
                        Phone: {report.Patient.phoneNumber}
                        {report.Patient.email && <>, Email: {report.Patient.email}</>}
                      </small>
                    </p>
                  ) : (
                    <p>Unknown Patient</p>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Doctor</h5>
                  {report.Doctor && report.Doctor.User ? (
                    <p>
                      <Link to={`/doctors/${report.Doctor.id}`}>
                        Dr. {report.Doctor.User.firstName} {report.Doctor.User.lastName}
                      </Link>
                      <br />
                      <small className="text-muted">
                        Specialization: {report.Doctor.specialization}
                      </small>
                    </p>
                  ) : (
                    <p>Unknown Doctor</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Diagnosis</h5>
                  <p>{report.diagnosis || 'No diagnosis provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Treatment</h5>
                  <p>{report.treatment || 'No treatment provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Prescription</h5>
                  <p>{report.prescription || 'No prescription provided'}</p>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h5>Additional Notes</h5>
                  <p>{report.notes || 'No additional notes'}</p>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="attachments" title="Attachments">
              <FileAttachmentList entityType="report" entityId={id} />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MedicalReportDetail;
