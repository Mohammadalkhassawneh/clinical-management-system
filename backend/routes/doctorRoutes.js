const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Get all doctors
router.get('/', doctorController.getAllDoctors);

// Get doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Create new doctor - admin only
router.post('/', isAdmin, doctorController.createDoctor);

// Update doctor - admin only
router.put('/:id', isAdmin, doctorController.updateDoctor);

// Delete doctor - admin only
router.delete('/:id', isAdmin, doctorController.deleteDoctor);

module.exports = router;
