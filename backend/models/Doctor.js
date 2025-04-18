const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: 'id'
    }
  },
  specialization: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'license_number'
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'phone_number'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'doctors',
  timestamps: false
});

// Define association
Doctor.belongsTo(User, { foreignKey: 'userId' });

module.exports = Doctor;
