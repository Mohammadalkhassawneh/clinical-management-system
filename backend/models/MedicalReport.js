const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const User = require('./User');
const Appointment = require('./Appointment');

const MedicalReport = sequelize.define('MedicalReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'patient_id',
    references: {
      model: Patient,
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'doctor_id',
    references: {
      model: Doctor,
      key: 'id'
    }
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'appointment_id',
    references: {
      model: Appointment,
      key: 'id'
    }
  },
  reportDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'report_date'
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  followUpInstructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'follow_up_instructions'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'medical_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
MedicalReport.belongsTo(Patient, { foreignKey: 'patientId' });
MedicalReport.belongsTo(Doctor, { foreignKey: 'doctorId' });
MedicalReport.belongsTo(Appointment, { foreignKey: 'appointmentId' });
MedicalReport.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = MedicalReport;
