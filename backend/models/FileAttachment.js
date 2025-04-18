const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const FileAttachment = sequelize.define('FileAttachment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'file_name'
  },
  filePath: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'file_path'
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'file_type'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'file_size'
  },
  entityType: {
    type: DataTypes.ENUM('patient', 'appointment', 'report'),
    allowNull: false,
    field: 'entity_type'
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'entity_id'
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'uploaded_by',
    references: {
      model: User,
      key: 'id'
    }
  },
  uploadDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'upload_date'
  }
}, {
  tableName: 'file_attachments',
  timestamps: false
});

// Define association
FileAttachment.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

module.exports = FileAttachment;
