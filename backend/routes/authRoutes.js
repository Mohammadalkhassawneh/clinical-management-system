const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.get('/users', authenticateToken, isAdmin, authController.getAllUsers);
router.get('/users/:id', authenticateToken, isAdmin, authController.getUserById);
router.put('/users/:id', authenticateToken, isAdmin, authController.updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, authController.deleteUser);

module.exports = router;
