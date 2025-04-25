import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Unauthorized from './components/auth/Unauthorized';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/dashboard/Dashboard';

// Patient Components
import PatientList from './components/patients/PatientList';
import PatientDetail from './components/patients/PatientDetail';
import PatientForm from './components/patients/PatientForm';

// Doctor Components
import DoctorList from './components/doctors/DoctorList';
import DoctorDetail from './components/doctors/DoctorDetail';
import DoctorForm from './components/doctors/DoctorForm';

// Appointment Components
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentDetail from './components/appointments/AppointmentDetail';
import AppointmentForm from './components/appointments/AppointmentForm';

// Medical Report Components
import MedicalReportList from './components/reports/MedicalReportList';
import MedicalReportDetail from './components/reports/MedicalReportDetail';
import MedicalReportForm from './components/reports/MedicalReportForm';

// Auth Context
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import ActivityLogs from './components/ActivityLogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin-only routes */}
            <Route path="/register" element={
              <PrivateRoute requiredRoles={['admin']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <Register />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/activity-logs" element={
              <PrivateRoute requiredRoles={['admin']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <ActivityLogs />
                  </div>
                </div>
              </PrivateRoute>
            } />
            {/* Dashboard - accessible to all authenticated users */}
            <Route path="/" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <Dashboard />
                  </div>
                </div>
              </PrivateRoute>
            } />

            {/* Patient Routes - accessible to all authenticated users */}
            <Route path="/patients" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <PatientList />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/patients/new" element={
              <PrivateRoute requiredRoles={['admin', 'receptionist']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <PatientForm />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/patients/:id" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <PatientDetail />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/patients/:id/edit" element={
              <PrivateRoute requiredRoles={['admin', 'receptionist']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <PatientForm />
                  </div>
                </div>
              </PrivateRoute>
            } />

            {/* Doctor Routes - admin can manage, others can view */}
            <Route path="/doctors" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <DoctorList />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/doctors/new" element={
              <PrivateRoute requiredRoles={['admin']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <DoctorForm />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/doctors/:id" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <DoctorDetail />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/doctors/:id/edit" element={
              <PrivateRoute requiredRoles={['admin']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <DoctorForm />
                  </div>
                </div>
              </PrivateRoute>
            } />

            {/* Appointment Routes */}
            <Route path="/appointments" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <AppointmentList />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/appointments/new" element={
              <PrivateRoute requiredRoles={['admin', 'receptionist', 'doctor']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <AppointmentForm />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/appointments/:id" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <AppointmentDetail />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/appointments/:id/edit" element={
              <PrivateRoute requiredRoles={['admin', 'receptionist', 'doctor']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <AppointmentForm />
                  </div>
                </div>
              </PrivateRoute>
            } />

            {/* Medical Report Routes - doctors and admins can create/edit */}
            <Route path="/reports" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <MedicalReportList />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/reports/new" element={
              <PrivateRoute requiredRoles={['admin', 'doctor']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <MedicalReportForm />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/reports/:id" element={
              <PrivateRoute>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <MedicalReportDetail />
                  </div>
                </div>
              </PrivateRoute>
            } />
            <Route path="/reports/:id/edit" element={
              <PrivateRoute requiredRoles={['admin', 'doctor']}>
                <div className="d-flex">
                  <Sidebar />
                  <div className="content-wrapper">
                    <Navbar />
                    <MedicalReportForm />
                  </div>
                </div>
              </PrivateRoute>
            } />

            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
