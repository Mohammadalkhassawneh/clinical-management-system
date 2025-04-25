const express = require('express');
const router = express.Router();
const activityLogsController = require('../controllers/activityLogsController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Only admins can access activity logs
router.get('/', authenticateToken, isAdmin, activityLogsController.getActivityLogs);

module.exports = router;