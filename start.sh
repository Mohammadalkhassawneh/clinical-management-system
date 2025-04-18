#!/bin/bash

# Script to initialize and start the Clinic Management System

echo "Starting Clinic Management System deployment..."

# Navigate to project root
cd "$(dirname "$0")"

# Create necessary directories if they don't exist
mkdir -p backend/uploads
mkdir -p backend/database

# Initialize backend
echo "Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOF
PORT=5000
DB_PATH=./database/clinic.sqlite
JWT_SECRET=clinic_management_secret_key
JWT_EXPIRES_IN=24h
EOF
fi

# Initialize database
echo "Initializing database..."
node -e "const db = require('./models'); db.sequelize.sync({ force: true }).then(() => { console.log('Database initialized'); process.exit(0); }).catch(err => { console.error('Error initializing database:', err); process.exit(1); });"

# Create initial admin user
echo "Creating initial admin user..."
node -e "const { User } = require('./models'); const bcrypt = require('bcrypt'); User.create({ username: 'admin', password: bcrypt.hashSync('admin123', 10), firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'admin' }).then(() => { console.log('Admin user created'); process.exit(0); }).catch(err => { console.error('Error creating admin user:', err); process.exit(1); });"

# Create test users
echo "Creating test users..."
node -e "const { User, Doctor } = require('./models'); const bcrypt = require('bcrypt'); Promise.all([User.create({ username: 'doctor', password: bcrypt.hashSync('doctor123', 10), firstName: 'John', lastName: 'Doe', email: 'doctor@example.com', role: 'doctor' }).then(user => Doctor.create({ userId: user.id, specialization: 'General Medicine', licenseNumber: 'MD12345' })), User.create({ username: 'receptionist', password: bcrypt.hashSync('receptionist123', 10), firstName: 'Jane', lastName: 'Smith', email: 'receptionist@example.com', role: 'receptionist' })]).then(() => { console.log('Test users created'); process.exit(0); }).catch(err => { console.error('Error creating test users:', err); process.exit(1); });"

# Start backend server
echo "Starting backend server..."
npx nodemon server.js &
BACKEND_PID=$!

# Navigate to frontend
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Start frontend development server
echo "Starting frontend development server..."
npm start &
FRONTEND_PID=$!

echo "Clinic Management System is now running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Use the following credentials to log in:"
echo "Admin: username=admin, password=admin123"
echo "Doctor: username=doctor, password=doctor123"
echo "Receptionist: username=receptionist, password=receptionist123"
echo ""
echo "Press Ctrl+C to stop the servers"

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; echo 'Servers stopped'; exit" INT
wait
