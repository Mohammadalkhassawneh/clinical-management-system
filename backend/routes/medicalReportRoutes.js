const express = require('express');
const router = express.Router();
const medicalReportController = require('../controllers/medicalReportController');
const { authenticateToken, isDoctor } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Get all medical reports
router.get('/', medicalReportController.getAllMedicalReports);

// Get medical report by ID
router.get('/:id', medicalReportController.getMedicalReportById);

// Create new medical report - only doctors can create
router.post('/', isDoctor, medicalReportController.createMedicalReport);

// Update medical report - only doctors can update
router.put('/:id', isDoctor, medicalReportController.updateMedicalReport);

// Delete medical report - only doctors can delete
router.delete('/:id', isDoctor, medicalReportController.deleteMedicalReport);

module.exports = router;
