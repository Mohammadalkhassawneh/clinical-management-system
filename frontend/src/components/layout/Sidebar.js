import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="sidebar bg-light">
      <div className="sidebar-sticky p-3">
        <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Main Menu</span>
        </h5>
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') && !isActive('/patients') && !isActive('/doctors') && !isActive('/appointments') && !isActive('/reports') ? 'active' : ''}
            >
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="/patients" 
              className={isActive('/patients') ? 'active' : ''}
            >
              Patients
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="/doctors" 
              className={isActive('/doctors') ? 'active' : ''}
            >
              Doctors
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="/appointments" 
              className={isActive('/appointments') ? 'active' : ''}
            >
              Appointments
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to="/reports" 
              className={isActive('/reports') ? 'active' : ''}
            >
              Medical Reports
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {user && user.role === 'admin' && (
          <>
            <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>Administration</span>
            </h5>
            <Nav className="flex-column">
              <Nav.Item>
                <Nav.Link as={Link} to="/register">
                  Register User
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/activity-logs">
                  Activity Logs report
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
