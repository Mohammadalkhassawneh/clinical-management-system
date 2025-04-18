const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FileAttachment, User } = require('../models');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, and XLSX files are allowed.'), false);
  }
};

// Initialize upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload file middleware
exports.uploadFile = upload.single('file');

// Create a new file attachment
exports.createFileAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { entityType, entityId } = req.body;

    if (!entityType || !entityId) {
      return res.status(400).json({ message: 'Entity type and ID are required' });
    }

    const fileAttachment = await FileAttachment.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      entityType,
      entityId,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      fileAttachment
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all file attachments
exports.getAllFileAttachments = async (req, res) => {
  try {
    const fileAttachments = await FileAttachment.findAll({
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    res.status(200).json({ fileAttachments });
  } catch (error) {
    console.error('Error getting all file attachments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get file attachments by entity
exports.getFileAttachmentsByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const fileAttachments = await FileAttachment.findAll({
      where: { entityType, entityId },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    res.status(200).json({ fileAttachments });
  } catch (error) {
    console.error('Error getting file attachments by entity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get file attachment by ID
exports.getFileAttachmentById = async (req, res) => {
  try {
    const fileAttachment = await FileAttachment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!fileAttachment) {
      return res.status(404).json({ message: 'File attachment not found' });
    }

    res.status(200).json({ fileAttachment });
  } catch (error) {
    console.error('Error getting file attachment by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const fileAttachment = await FileAttachment.findByPk(req.params.id);

    if (!fileAttachment) {
      return res.status(404).json({ message: 'File attachment not found' });
    }

    res.download(fileAttachment.filePath, fileAttachment.fileName);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete file attachment
exports.deleteFileAttachment = async (req, res) => {
  try {
    const fileAttachment = await FileAttachment.findByPk(req.params.id);
    if (!fileAttachment) {
      return res.status(404).json({ message: 'File attachment not found' });
    }

    // Delete file from filesystem
    fs.unlink(fileAttachment.filePath, async (err) => {
      if (err) {
        console.error('Error deleting file from filesystem:', err);
      }

      // Delete record from database
      await fileAttachment.destroy();

      res.status(200).json({ message: 'File attachment deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting file attachment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
