const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, isDoctor, isReceptionist } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Create new appointment - receptionist and doctor can create
router.post('/', appointmentController.createAppointment);

// Update appointment
router.put('/:id', appointmentController.updateAppointment);

// Delete appointment - receptionist can delete
router.delete('/:id', isReceptionist, appointmentController.deleteAppointment);

module.exports = router;
