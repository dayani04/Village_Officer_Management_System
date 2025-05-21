import React from 'react';
import { Container, Row, Col, Navbar, Nav, Card, ListGroup } from 'react-bootstrap';

function VillageOfficerDashBoard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#343a40',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '2rem' }}>My Dashboard</h3>
        <Nav defaultActiveKey="#home" className="flex-column" style={{ gap: '1rem' }}>
          <Nav.Link href="#home" style={{ color: '#adb5bd' }}>Home</Nav.Link>
          <Nav.Link href="#analytics" style={{ color: '#adb5bd' }}>Analytics</Nav.Link>
          <Nav.Link href="#reports" style={{ color: '#adb5bd' }}>Reports</Nav.Link>
          <Nav.Link href="#settings" style={{ color: '#adb5bd' }}>Settings</Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <Navbar bg="light" expand="lg" style={{ padding: '1rem' }}>
          <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
        </Navbar>

        {/* Content Area */}
        <Container fluid style={{ padding: '2rem' }}>
          {/* Welcome Card */}
          <Row className="mb-4">
            <Col>
              <Card className="p-3" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Welcome back!</Card.Title>
                  <Card.Text>
                    Here is an overview of your recent activity and stats.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="g-4">
            <Col md={4}>
              <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Total Users</Card.Title>
                  <h2>1,234</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Sales</Card.Title>
                  <h2>$56,789</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Active Sessions</Card.Title>
                  <h2>89</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities */}
          <Row className="mt-4">
            <Col>
              <Card style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Card.Body>
                  <Card.Title>Recent Activities</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      User JohnDoe signed in 2 hours ago
                    </ListGroup.Item>
                    <ListGroup.Item>
                      New report generated on Sales
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Server backup completed successfully
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default VillageOfficerDashBoard;