# Clinic Management System

A full-stack web application for managing clicinals

## Features

- **Patient Management**: Add, view, edit, and delete patient records
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Schedule and track patient appointments
- **Medical Reports**: Create and manage detailed medical reports
- **File Attachments**: Upload and manage files for patients and reports
- **Role-Based Access Control**: Different permissions for admin, doctors, and receptionists
- **Dashboard**: Overview of clinic statistics and recent activities

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite with Sequelize ORM
- **Frontend**: React with Bootstrap
- **Authentication**: JWT-based authentication

## Project Structure

```
clinical-management-system/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── database/       # SQLite database
│   ├── middleware/     # Custom middleware
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── uploads/        # Uploaded files
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── context/    # React context
│       ├── utils/      # Utility functions
│       └── App.js      # Main component
```

## User Roles

- **Admin**: Full access to all features
- **Doctor**: Can manage appointments, create medical reports, and view patient information
- **Receptionist**: Can manage patients and appointments
- **Regular User**: Limited access to view information

## Project setup
All setup command are write inside start.sh file, so you only need to run ./start.sh from the command line