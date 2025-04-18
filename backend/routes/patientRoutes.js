const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticateToken, isAdmin, isReceptionist } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Get all patients
router.get('/', patientController.getAllPatients);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

// Create new patient - admin and receptionist only
router.post('/', isReceptionist, patientController.createPatient);

// Update patient - admin and receptionist only
router.put('/:id', isReceptionist, patientController.updatePatient);

// Delete patient - admin only
router.delete('/:id', isAdmin, patientController.deletePatient);

module.exports = router;
