const express = require('express');
const router = express.Router();
const fileAttachmentController = require('../controllers/fileAttachmentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// Get all file attachments
router.get('/', fileAttachmentController.getAllFileAttachments);

// Get file attachments by entity
router.get('/entity/:entityType/:entityId', fileAttachmentController.getFileAttachmentsByEntity);

// Get file attachment by ID
router.get('/:id', fileAttachmentController.getFileAttachmentById);

// Upload new file attachment
router.post('/upload', fileAttachmentController.uploadFile, fileAttachmentController.createFileAttachment);

// Download file
router.get('/download/:id', fileAttachmentController.downloadFile);

// Delete file attachment
router.delete('/:id', fileAttachmentController.deleteFileAttachment);

module.exports = router;
