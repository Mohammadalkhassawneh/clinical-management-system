const { MedicalReport, Patient, Doctor, Appointment, User } = require('../models');

// Create a new medical report
exports.createMedicalReport = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      reportDate,
      diagnosis,
      treatment,
      prescription,
      followUpInstructions
    } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment exists if provided
    if (appointmentId) {
      const appointment = await Appointment.findByPk(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
    }

    const medicalReport = await MedicalReport.create({
      patientId,
      doctorId,
      appointmentId,
      reportDate,
      diagnosis,
      treatment,
      prescription,
      followUpInstructions,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Medical report created successfully',
      medicalReport
    });
  } catch (error) {
    console.error('Error creating medical report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all medical reports
exports.getAllMedicalReports = async (req, res) => {
  try {
    const medicalReports = await MedicalReport.findAll({
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Doctor,
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Appointment,
          attributes: ['id', 'appointmentDate', 'appointmentTime']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    res.status(200).json({ medicalReports });
  } catch (error) {
    console.error('Error getting all medical reports:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get medical report by ID
exports.getMedicalReportById = async (req, res) => {
  try {
    const medicalReport = await MedicalReport.findByPk(req.params.id, {
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender']
        },
        {
          model: Doctor,
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Appointment,
          attributes: ['id', 'appointmentDate', 'appointmentTime', 'status']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });

    if (!medicalReport) {
      return res.status(404).json({ message: 'Medical report not found' });
    }

    res.status(200).json({ medicalReport });
  } catch (error) {
    console.error('Error getting medical report by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medical report
exports.updateMedicalReport = async (req, res) => {
  try {
    const {
      reportDate,
      diagnosis,
      treatment,
      prescription,
      followUpInstructions
    } = req.body;

    const medicalReport = await MedicalReport.findByPk(req.params.id);
    if (!medicalReport) {
      return res.status(404).json({ message: 'Medical report not found' });
    }

    // Update medical report fields
    medicalReport.reportDate = reportDate || medicalReport.reportDate;
    medicalReport.diagnosis = diagnosis || medicalReport.diagnosis;
    medicalReport.treatment = treatment || medicalReport.treatment;
    medicalReport.prescription = prescription || medicalReport.prescription;
    medicalReport.followUpInstructions = followUpInstructions || medicalReport.followUpInstructions;

    await medicalReport.save();
    // Get updated medical report with related information
    const updatedMedicalReport = await MedicalReport.findByPk(req.params.id, {
      include: [
        {
          model: Patient,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Doctor,
          include: [
            {
              model: User,
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: 'Medical report updated successfully',
      medicalReport: updatedMedicalReport
    });
  } catch (error) {
    console.error('Error updating medical report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medical report
exports.deleteMedicalReport = async (req, res) => {
  try {
    const medicalReport = await MedicalReport.findByPk(req.params.id);
    if (!medicalReport) {
      return res.status(404).json({ message: 'Medical report not found' });
    }

    await medicalReport.destroy();

    res.status(200).json({ message: 'Medical report deleted successfully' });
  } catch (error) {
    console.error('Error deleting medical report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
