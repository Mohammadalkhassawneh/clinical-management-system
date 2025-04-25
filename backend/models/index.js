const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Appointment = require('./Appointment');
const MedicalReport = require('./MedicalReport');
const FileAttachment = require('./FileAttachment');
const ActivityLog = require('./ActivityLog');

// Define additional associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Patient.hasMany(MedicalReport, { foreignKey: 'patientId' });
Doctor.hasMany(MedicalReport, { foreignKey: 'doctorId' });
Appointment.hasMany(MedicalReport, { foreignKey: 'appointmentId' });
ActivityLog.belongsTo(User, { foreignKey: 'userId' });

// Export all models
module.exports = {
  sequelize,
  User,
  Doctor,
  Patient,
  Appointment,
  MedicalReport,
  FileAttachment,
  ActivityLog
};
