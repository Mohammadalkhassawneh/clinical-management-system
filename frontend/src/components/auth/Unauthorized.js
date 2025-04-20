import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="danger">
            <Alert.Heading>Access Denied</Alert.Heading>
            <p>
              You do not have permission to access this page. This area requires higher privileges.
            </p>
            <hr />
            <p className="mb-0">
              Please contact your administrator if you believe you should have access to this area.
            </p>
            <div className="mt-3">
              <Link to="/" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;
